import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, RefreshControl } from "react-native";
import api from "../services/api";
import DeviceCard from "../components/DeviceCard";
import DeviceStatusModal from "../components/DeviceStatusModal";
import styles from "../styles/DashboardScreen.styles";

export default function DashboardScreen({ navigation }) {
  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  async function loadDevices() {
    try {
      const { data } = await api.get("/tuya/devices");
      setDevices(data.devices || []);
    } catch (e) {
      console.log("Erro ao carregar dispositivos", e?.message);
    }
  }

  useEffect(() => {
    loadDevices();
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    await loadDevices();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Dispositivos</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DeviceCard device={item} onPress={() => setSelected(item)} />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text>Nenhum dispositivo encontrado.</Text>}
      />
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <DeviceStatusModal device={selected} onClose={() => setSelected(null)} />
      </Modal>
      <TouchableOpacity
        style={styles.connectButton}
        onPress={() => navigation.navigate("DeviceDetail", { mode: "connect" })}
      >
        <Text style={styles.connectButtonText}>Conectar Conta Tuya</Text>
      </TouchableOpacity>
    </View>
  );
}
