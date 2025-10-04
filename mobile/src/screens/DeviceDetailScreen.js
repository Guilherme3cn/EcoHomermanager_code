import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import api from "../services/api";

export default function DeviceDetailScreen({ route, navigation }) {
  const { id, mode } = route.params || {};
  const [status, setStatus] = useState(null);

  async function fetchStatus() {
    if (!id) return;
    try {
      const { data } = await api.get(`/tuya/device/${id}/status`);
      setStatus(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o status do dispositivo.");
    }
  }

  useEffect(() => {
    if (id) {
      fetchStatus();
    }
  }, [id]);

  async function onConnectTuya() {
    // No fluxo real abra a URL de autorização Tuya/Smart Life
    try {
      const url = `${process.env.EXPO_PUBLIC_API_URL?.replace(/\/api$/, "")}/api/tuya/login`; // placeholder
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir o login Tuya.");
    }
  }

  if (mode === "connect") {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Conectar Tuya</Text>
        <Text style={{ marginTop: 8 }}>
          Toque abaixo para abrir a tela de login do Smart Life (Tuya). Após permitir acesso, volte ao app e recarregue o Dashboard.
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
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={{ color: "#0ea5e9", textAlign: "center" }}>Já conectei minha conta</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Status do Dispositivo</Text>
      {status ? (
        <>
          <Text>Potência atual (W): {String(status.cur_power ?? "-")}</Text>
          <Text>Energia acumulada (kWh): {String(status.add_ele ?? "-")}</Text>
          <Text>Tensão (V): {String(status.cur_voltage ?? "-")}</Text>
          <Text>Corrente (A): {String(status.cur_current ?? "-")}</Text>
        </>
      ) : (
        <Text>Carregando...</Text>
      )}
    </View>
  );
}
