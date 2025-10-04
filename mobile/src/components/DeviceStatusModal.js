import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useApi } from "../services/api";
import styles from "../styles/DeviceStatusModal.styles";

export default function DeviceStatusModal({ device, onClose }) {
  const api = useApi();
  const [status, setStatus] = useState(null);

  const loadStatus = useCallback(async () => {
    if (!device) return;
    try {
      const { data } = await api.get(`/tuya/device/${device.id}/status`);
      setStatus(data);
    } catch (error) {
      console.log("Erro ao carregar status", error);
    }
  }, [api, device]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  if (!device) return null;

  return (
    <View style={styles.backdrop}>
      <View style={styles.modal}>
        <Text style={styles.title}>{device.name}</Text>
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
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Text style={styles.closeText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
