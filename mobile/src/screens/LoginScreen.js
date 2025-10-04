import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import styles from "../styles/LoginScreen.styles";

export default function LoginScreen({ navigation }) {
  const { signIn, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function onLogin() {
    if (!isLoaded) return;

    try {
      await signIn.create({ identifier: email, password });
      await signIn.prepareFirstFactor({ strategy: "password" });
    } catch (e) {
      setError("Falha ao entrar. Verifique suas credenciais.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EcoHome Manager</Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Senha"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Criar conta</Text>
      </TouchableOpacity>
    </View>
  );
}
