import React from "react";
import { ClerkProvider } from "@clerk/clerk-expo";
import Navigator from "./src/navigation";
import { tokenCache } from "./src/services/auth";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY não configurada");
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <Navigator />
    </ClerkProvider>
  );
}
