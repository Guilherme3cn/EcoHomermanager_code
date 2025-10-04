import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useSignIn, useOAuth } from "@clerk/clerk-expo";
import { makeRedirectUri } from "expo-auth-session";
import styles from "../styles/LoginScreen.styles";

const redirectUri = makeRedirectUri({
  scheme: "ecomanager",
  useProxy: true,
});

function extractClerkError(error) {
  if (!error) return "Falha ao entrar.";
  if (error.errors?.length) {
    return error.errors.map((err) => err.message).join("\n");
  }
  return error.message || "Falha ao entrar.";
}

export default function LoginScreen({ navigation }) {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow, isLoaded: oauthLoaded } = useOAuth({ strategy: "oauth_google" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    if (!isLoaded || loading) return;
    setLoading(true);

    try {
      const attempt = await signIn.create({ identifier: email.trim(), password });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        return;
      }

      if (attempt.status === "needs_first_factor") {
        const firstFactor = await signIn.attemptFirstFactor({
          strategy: "password",
          password,
        });
        if (firstFactor.status === "complete") {
          await setActive({ session: firstFactor.createdSessionId });
          return;
        }
      }

      Alert.alert("Verifica??o necess?ria", "Complete a etapa adicional enviada pela Clerk.");
    } catch (error) {
      console.log("Erro ao entrar", error);
      Alert.alert("Falha ao entrar", extractClerkError(error));
    } finally {
      setLoading(false);
    }
  }

  async function onGoogleLogin() {
    if (!oauthLoaded) return;

    try {
      const { createdSessionId, setActive: setOAuthActive } = await startOAuthFlow({
        redirectUrl: redirectUri,
      });

      if (createdSessionId && setOAuthActive) {
        await setOAuthActive({ session: createdSessionId });
      }
    } catch (error) {
      console.log("Erro OAuth", error);
      Alert.alert("Google", extractClerkError(error));
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EcoHome Manager</Text>

      <TouchableOpacity style={styles.socialButton} onPress={onGoogleLogin}>
        <Text style={styles.socialButtonText}>Entrar com Google</Text>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>Ou use email e senha</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
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
      <TouchableOpacity style={styles.button} onPress={onLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Entrando..." : "Entrar"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Criar conta</Text>
      </TouchableOpacity>
    </View>
  );
}
