import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  sectionLabel: {
    textAlign: "center",
    marginVertical: 12,
    color: colors.muted,
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  socialButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  socialButtonText: {
    color: "#111827",
    fontWeight: "600",
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    color: colors.secondary,
  },
  error: {
    color: colors.danger,
    marginBottom: 8,
    textAlign: "center",
  },
});
