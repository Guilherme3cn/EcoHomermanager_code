import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import api from "../services/api";
import styles from "../styles/DeviceStatusModal.styles";

export default function DeviceStatusModal({ device, onClose }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    (async () => {
      if (!device) return;
      try {
        const { data } = await api.get(`/tuya/device/${device.id}/status`);
        setStatus(data);
      } catch (error) {
        console.log("Erro ao carregar status", error);
      }
    })();
  }, [device]);

  if (!device) return null;

  return (
    <View style={styles.backdrop}>
      <View style={styles.modal}>
        <Text style={styles.title}>{device.name}</Text>
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
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Text style={styles.closeText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
