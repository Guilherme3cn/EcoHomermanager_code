import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/DeviceCard.styles";

export default function DeviceCard({ device, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.icon} />
      <View style={styles.info}>
        <Text style={styles.name}>{device.name}</Text>
        <Text style={[styles.status, { color: device.online ? "#16a34a" : "#6b7280" }]}>
          {device.online ? "Online" : "Offline"}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}
