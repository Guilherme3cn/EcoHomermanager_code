import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, RefreshControl } from "react-native";
import { useClerk } from "@clerk/clerk-expo";
import { useApi } from "../services/api";
import DeviceCard from "../components/DeviceCard";
import DeviceStatusModal from "../components/DeviceStatusModal";
import EHButton from "../components/EHButton";
import styles from "../styles/DashboardScreen.styles";

export default function DashboardScreen({ navigation }) {
  const api = useApi();
  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { signOut } = useClerk();

  const loadDevices = useCallback(async () => {
    try {
      const { data } = await api.get("/tuya/devices");
      setDevices(data.devices || []);
    } catch (e) {
      console.log("Erro ao carregar dispositivos", e?.message);
    }
  }, [api]);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDevices();
    setRefreshing(false);
  }, [loadDevices]);

  async function handleSignOut() {
    try {
      await signOut();
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (error) {
      console.log("Erro ao sair", error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Dispositivos</Text>
        <EHButton label="Sair" onPress={handleSignOut} style={styles.logoutButton} />
      </View>

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
