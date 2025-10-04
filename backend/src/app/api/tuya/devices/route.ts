import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { ensureValidToken } from "@/lib/tokenRefresh";
import { tuyaRequest } from "@/lib/tuya";

// Lista dispositivos do usuário autenticado via Tuya
export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return new Response("Não autenticado", { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({ where: { clerkUserId: userId } });

  if (!dbUser) {
    return new Response("Usuário não encontrado", { status: 404 });
  }

  try {
    const token = await ensureValidToken(dbUser.id);
    const data = await tuyaRequest<any>(`/v1.0/iot-03/devices`, token);

    const devices = (data?.result || data?.devices || []).map((d: any) => ({
      id: d.id || d.device_id,
      name: d.name,
      category: d.category,
      online: Boolean(d.online),
      room_name: d.room_name || null,
      icon: d.icon || null,
    }));

    return new Response(JSON.stringify({ devices }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Falha ao listar" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
