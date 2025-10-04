import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { useApi } from "../services/api";

const TUYA_BASE_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_TUYA_BASE_URL ?? process.env.EXPO_PUBLIC_TUYA_BASE_URL;
const TUYA_CLIENT_ID =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_TUYA_CLIENT_ID ?? process.env.EXPO_PUBLIC_TUYA_CLIENT_ID;
const TUYA_REDIRECT_URI =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_TUYA_REDIRECT_URI ?? process.env.EXPO_PUBLIC_TUYA_REDIRECT_URI;
const TUYA_AUTHORIZE_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_TUYA_AUTHORIZE_URL ??
  `${TUYA_BASE_URL ?? ""}/v1.0/iot-03/authorize`;

function buildTuyaAuthorizeUrl() {
  if (!TUYA_CLIENT_ID || !TUYA_REDIRECT_URI) {
    return null;
  }

  const authBase = TUYA_AUTHORIZE_URL;
  if (!authBase) {
    return null;
  }

  if (authBase.includes("redirect_uri=") && authBase.includes("client_id=")) {
    return authBase;
  }

  const params = new URLSearchParams({
    client_id: TUYA_CLIENT_ID,
    response_type: "code",
    redirect_uri: TUYA_REDIRECT_URI,
    state: String(Date.now()),
  });

  return `${authBase}?${params.toString()}`;
}

export default function DeviceDetailScreen({ route, navigation }) {
  const api = useApi();
  const { id, mode } = route.params || {};
  const [status, setStatus] = useState(null);

  const fetchStatus = useCallback(async () => {
    if (!id) return;
    try {
      const { data } = await api.get(`/tuya/device/${id}/status`);
      setStatus(data);
    } catch (error) {
      Alert.alert("Erro", "N?o foi poss?vel carregar o status do dispositivo.");
    }
  }, [api, id]);

  useEffect(() => {
    if (id) {
      fetchStatus();
    }
  }, [id, fetchStatus]);

  async function onConnectTuya() {
    const authorizeUrl = buildTuyaAuthorizeUrl();
    if (!authorizeUrl) {
      Alert.alert(
        "Configura??o ausente",
        "Verifique EXPO_PUBLIC_TUYA_CLIENT_ID, REDIRECT_URI e AUTHORIZE_URL no app.json.",
      );
      return;
    }

    try {
      const result = await WebBrowser.openAuthSessionAsync(authorizeUrl, TUYA_REDIRECT_URI);
      if (result.type === "success" && result.url) {
        const { searchParams } = new URL(result.url);
        const code = searchParams.get("code");
        if (code) {
          await api.post("/tuya/login-tuya", { code });
          Alert.alert("Conta conectada", "Atualize o dashboard para listar seus dispositivos.");
          navigation.goBack();
        }
      }
    } catch (error) {
      console.log("Erro ao abrir login Tuya", error);
      Alert.alert("Erro", "N?o foi poss?vel abrir o login Tuya.");
    }
  }

  if (mode === "connect") {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Conectar Tuya</Text>
        <Text style={{ marginTop: 8 }}>
          Toque abaixo para abrir o login Smart Life (Tuya). Ap?s autorizar o acesso, volte ao app e atualize o Dashboard.
        </Text>
        <TouchableOpacity
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "#0ea5e9",
            borderRadius: 8,
          }}
          onPress={onConnectTuya}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>Abrir login Smart Life</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 16 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: "#0ea5e9", textAlign: "center" }}>J? conectei minha conta</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Status do Dispositivo</Text>
      {status ? (
        <>
          <Text>Pot?ncia atual (W): {String(status.cur_power ?? "-")}</Text>
          <Text>Energia acumulada (kWh): {String(status.add_ele ?? "-")}</Text>
          <Text>Tens?o (V): {String(status.cur_voltage ?? "-")}</Text>
          <Text>Corrente (A): {String(status.cur_current ?? "-")}</Text>
        </>
      ) : (
        <Text>Carregando...</Text>
      )}
    </View>
  );
}
