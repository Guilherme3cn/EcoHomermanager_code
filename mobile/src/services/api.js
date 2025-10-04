import { useMemo } from "react";
import axios from "axios";
import Constants from "expo-constants";
import { useAuth } from "@clerk/clerk-expo";

const baseURL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ?? process.env.EXPO_PUBLIC_API_URL;

export function useApi() {
  const { getToken } = useAuth();

  return useMemo(() => {
    const instance = axios.create({ baseURL });

    instance.interceptors.request.use(async (config) => {
      try {
        const token = await getToken({ template: "default" });
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn("N?o foi poss?vel anexar token Clerk", error);
      }
      return config;
    });

    return instance;
  }, [getToken]);
}
