import * as SecureStore from "expo-secure-store";
import { getToken, useAuth, useOAuth, useUser } from "@clerk/clerk-expo";

export const tokenCache = {
  async getToken(key) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn("Falha ao recuperar token", error);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn("Falha ao salvar token", error);
    }
  },
};

// Hook utilitário para iniciar flows OAuth adicionais (ex: Tuya)
export function useTuyaOAuth() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const oauth = useOAuth({ strategy: "oauth_google" });

  return {
    isSignedIn,
    user,
    oauth,
  };
}

export async function getBackendToken() {
  try {
    return await getToken({ template: "default" });
  } catch (error) {
    console.warn("Erro ao obter token Clerk", error);
    return null;
  }
}
