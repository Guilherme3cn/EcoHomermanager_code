import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { computeExpiry, exchangeCodeForToken } from "@/lib/tuya";

const successPage = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>EcoHome Manager</title>
    <style>
      body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:#0f172a; color:#f8fafc; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; margin:0; padding:24px; text-align:center; }
      .card { background:#1e293b; padding:32px 24px; border-radius:16px; max-width:420px; }
      h1 { margin-top:0; font-size:24px; }
      p { line-height:1.5; }
      .hint { margin-top:16px; font-size:14px; opacity:0.8; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Autoriza??o conclu?da</h1>
      <p>Voc? j? pode voltar para o app EcoHome Manager. Se a janela n?o fechar automaticamente, feche manualmente.</p>
      <p class="hint">Caso o app n?o atualize, toque em "Concluir" no navegador em tela cheia ou retorne manualmente.</p>
    </div>
  </body>
</html>`;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return new Response("Missing authorization code.", { status: 400 });
  }

  return new Response(successPage, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

// Recebe o c?digo OAuth da Tuya, troca por tokens e persiste para o usu?rio
export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return new Response("N?o autenticado", { status: 401 });
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
