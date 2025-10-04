# Eco Home Manager

Monorepo profissional com backend Next.js 14 / Prisma / Clerk / Tuya e aplicativo mobile Expo para gerenciar dispositivos inteligentes.

## Pré-requisitos
- Node.js 18+
- Conta Neon + banco PostgreSQL
- Conta Clerk com aplicação configurada
- Credenciais Tuya Cloud/Smart Life (client_id, client_secret, redirect)
- Vercel CLI (para deploy do backend)
- Expo CLI / EAS CLI (para mobile)

## Estrutura
```
eco-home-manager/
├─ backend/        # Next.js 14 (App Router) + Prisma + Clerk
└─ mobile/         # Expo (React Native) + Clerk Expo
```

## Variáveis de ambiente
1. Copie `.env.example` para `backend/.env` e ajuste:
   ```env
   DATABASE_URL=
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   TUYA_BASE_URL=
   TUYA_CLIENT_ID=
   TUYA_CLIENT_SECRET=
   TUYA_REDIRECT_URI=
   ```
2. Ajuste `mobile/app.json` ou `eas.json` com:
   ```json
   {
     "EXPO_PUBLIC_API_URL": "http://localhost:3000/api",
     "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY": "pk_test_REPLACE"
   }
   ```

## Rodando localmente
### Backend
```bash
cd backend
npm install
Copy-Item .env.example .env # ou cp
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npx expo start
```

## Deploy
- Backend: conectar repositório ao GitHub e importar na Vercel, configurando variáveis e banco Neon.
- Mobile: usar `eas build`/`eas submit` (opcional) após configurar credenciais e ambientes.

## Testes rápidos (manuais)
1. Criar usuário no Clerk e fazer login pelo app mobile.
2. `GET /api/health` para checar backend.
3. Executar fluxo OAuth Tuya, conectar e listar dispositivos no Dashboard.
4. Abrir um dispositivo e validar métricas (`cur_power`, `add_ele`, `cur_voltage`, `cur_current`).

## Observações
- Ajuste endpoints Tuya conforme seu data center.
- Considere adicionar CORS/rate limiting em produção.
- Tokens Tuya são atualizados automaticamente via refresh.
- Estrutura pronta para incluir gráficos (Victory/Recharts) futuramente.
