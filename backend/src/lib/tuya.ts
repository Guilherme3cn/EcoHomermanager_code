import axios from "axios";
import dayjs from "dayjs";

const BASE = process.env.TUYA_BASE_URL!;
const CLIENT_ID = process.env.TUYA_CLIENT_ID!;
const CLIENT_SECRET = process.env.TUYA_CLIENT_SECRET!;
const REDIRECT_URI = process.env.TUYA_REDIRECT_URI!;

// Troca code OAuth por tokens Tuya
export async function exchangeCodeForToken(code: string) {
  const url = `${BASE}/v1.0/token?grant_type=authorization_code`;
  const { data } = await axios.post(url, {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
    redirect_uri: REDIRECT_URI,
  });

  return data?.result || data;
}

// Atualiza token usando refresh token Tuya
export async function refreshAccessToken(refreshToken: string) {
  const url = `${BASE}/v1.0/token/${refreshToken}`;
  const { data } = await axios.get(url);

  return data?.result || data;
}

// Faz requisições autenticadas na API Tuya
export async function tuyaRequest<T>(path: string, accessToken: string) {
  const url = `${BASE}${path}`;
  const { data } = await axios.get<T>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
}

export function computeExpiry(expiresInSeconds: number) {
  return dayjs().add(expiresInSeconds, "second").toDate();
}
