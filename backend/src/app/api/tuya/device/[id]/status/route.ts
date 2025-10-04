import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { ensureValidToken } from "@/lib/tokenRefresh";
import { tuyaRequest } from "@/lib/tuya";

// Recupera status detalhado do dispositivo informado
export async function GET(_: Request, { params }: { params: { id: string } }) {
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
    const data = await tuyaRequest<any>(`/v1.0/iot-03/devices/${params.id}/status`, token);

    const map = { cur_power: "cur_power", cur_voltage: "cur_voltage", cur_current: "cur_current", add_ele: "add_ele" } as const;
    const status: Record<string, unknown> = {
      cur_power: null,
      cur_voltage: null,
      cur_current: null,
      add_ele: null,
    };

    const list = data?.result || data?.status || [];
    for (const item of list) {
      const code = item.code || item.key;
      if (code && map[code as keyof typeof map]) {
        status[code] = item.value;
      }
    }

    return new Response(JSON.stringify(status), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Falha ao consultar status" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
