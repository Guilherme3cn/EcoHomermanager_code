import React from "react";
import { TouchableOpacity, Text } from "react-native";

export default function EHButton({ label, onPress, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#2563eb",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
        ...(style || {}),
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "600" }}>{label}</Text>
    </TouchableOpacity>
  );
}
