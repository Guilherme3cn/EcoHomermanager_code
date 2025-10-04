import React from "react";
import { ClerkProvider } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import { tokenCache } from "./src/services/auth";
import Navigator from "./src/navigation";

WebBrowser.maybeCompleteAuthSession();

const CLERK_PUBLISHABLE_KEY =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ??
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY n?o configurada");
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <Navigator />
    </ClerkProvider>
  );
}
