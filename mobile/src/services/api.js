import axios from "axios";
import { getToken } from "@clerk/clerk-expo";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await getToken({ template: "default" });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("Não foi possível anexar token Clerk", error);
  }
  return config;
});

export default api;
