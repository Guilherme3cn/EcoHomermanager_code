import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useSignUp, useOAuth, useAuth } from "@clerk/clerk-expo";
import { makeRedirectUri } from "expo-auth-session";
import styles from "../styles/RegisterScreen.styles";

const redirectUri = makeRedirectUri({
  scheme: "ecomanager",
  useProxy: true,
});

function extractClerkError(error) {
  if (!error) return "Falha ao registrar.";
  if (error.errors?.length) {
    return error.errors.map((err) => err.message).join("\n");
  }
  return error.message || "Falha ao registrar.";
}

export default function RegisterScreen({ navigation }) {
  const { signUp, isLoaded } = useSignUp();
  const { setActive } = useAuth();
  const { startOAuthFlow, isLoaded: oauthLoaded } = useOAuth({ strategy: "oauth_google" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onRegister() {
    if (!isLoaded || loading) return;

    setLoading(true);
    try {
      await signUp.create({
        firstName: name || undefined,
        emailAddress: email.trim(),
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setIsCodeSent(true);
      setError(null);
      Alert.alert("Verificacao enviada", "Enviamos um codigo para seu email.");
    } catch (err) {
      console.log("Erro no cadastro", err);
      setError(extractClerkError(err));
    } finally {
      setLoading(false);
    }
  }

  async function onVerifyCode() {
    if (!isLoaded || loading) return;

    setLoading(true);
    try {
      await signUp.attemptEmailAddressVerification({ code });
      const completeSignUp = await signUp.finishSignUp();

      if (completeSignUp.createdSessionId) {
        await setActive({ session: completeSignUp.createdSessionId });
        Alert.alert("Conta criada", "Login efetuado com sucesso.");
        navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
      } else {
        Alert.alert("Conta criada", "Agora faca login com suas credenciais.");
        navigation.navigate("Login");
      }
      setError(null);
    } catch (err) {
      console.log("Erro na verificacao", err);
      setError(extractClerkError(err));
    } finally {
      setLoading(false);
    }
  }

  async function onGoogleSignUp() {
    if (!oauthLoaded) return;

    try {
      const { createdSessionId, setActive: setOAuthActive } = await startOAuthFlow({
        redirectUrl: redirectUri,
      });
      if (createdSessionId && setOAuthActive) {
        await setOAuthActive({ session: createdSessionId });
        Alert.alert("Conta criada", "Login efetuado com Google com sucesso.");
        navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
      }
    } catch (err) {
      console.log("Erro OAuth", err);
      Alert.alert("Erro", extractClerkError(err));
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>

      {!isCodeSent ? (
        <>
          <TouchableOpacity style={styles.socialButton} onPress={onGoogleSignUp}>
            <Text style={styles.socialButtonText}>Continuar com Google</Text>
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>Ou use seu email</Text>

          <TextInput
            placeholder="Nome"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
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
          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.button} onPress={onRegister} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Enviando..." : "Registrar"}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={{ marginBottom: 12, textAlign: "center" }}>
            Digite o codigo de 6 digitos enviado para {email}.
          </Text>
          <TextInput
            placeholder="Codigo"
            style={styles.input}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.button} onPress={onVerifyCode} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Validando..." : "Confirmar codigo"}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
