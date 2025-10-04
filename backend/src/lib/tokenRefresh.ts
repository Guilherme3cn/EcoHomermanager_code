import prisma from "./prisma";
import { refreshAccessToken } from "./tuya";

// Garante que o usuário possui um access token válido antes de chamar Tuya
export async function ensureValidToken(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.refreshToken) {
    throw new Error("Usuário sem integração Tuya.");
  }

  const now = new Date();

  if (!user.accessToken || !user.tokenExpiry || user.tokenExpiry <= now) {
    const refreshed = await refreshAccessToken(user.refreshToken);

    const newAccess = refreshed.access_token || refreshed.accessToken;
    const newRefresh = refreshed.refresh_token || refreshed.refreshToken || user.refreshToken;
    const expiresIn = refreshed.expires_in || 3600;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        accessToken: newAccess,
        refreshToken: newRefresh,
        tokenExpiry: new Date(Date.now() + expiresIn * 1000),
      },
    });

    return updated.accessToken!;
  }

  return user.accessToken;
}
