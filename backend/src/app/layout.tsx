import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

export const metadata = {
  title: "EcoHome Manager",
  description: "Dashboard de dispositivos inteligentes",
};

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY não configurada");
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="pt-BR">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
