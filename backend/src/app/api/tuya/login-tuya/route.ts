import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { computeExpiry, exchangeCodeForToken } from "@/lib/tuya";

// Recebe o código OAuth da Tuya, troca por tokens e persiste para o usuário
export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Não autenticado", { status: 401 });
  }

  const body = await req.json();
  const code = body?.code;

  if (!code) {
    return new Response("code ausente", { status: 400 });
  }

  try {
    const result = await exchangeCodeForToken(code);
    const accessToken = result.access_token;
    const refreshToken = result.refresh_token;
    const expiresIn = result.expires_in ?? 3600;
    const tuyaUid = result.uid || result.user_id || null;

    await prisma.user.upsert({
      where: { clerkUserId: userId },
      update: {
        accessToken,
        refreshToken,
        tokenExpiry: computeExpiry(expiresIn),
        tuyaUid,
      },
      create: {
        clerkUserId: userId,
        accessToken,
        refreshToken,
        tokenExpiry: computeExpiry(expiresIn),
        tuyaUid,
      },
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ ok: false, error: e?.message || "Falha ao integrar" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
