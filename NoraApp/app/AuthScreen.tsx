import React, { useState, useRef, useEffect } from "react";
import {
  ActivityIndicator,
  useColorScheme,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
} from "react-native";
import { Text } from "@/components/Themed";
import { useSession } from "@/src/context/AuthContext";
import { Redirect, router } from "expo-router";
import { useToast } from "@/src/context/ToastProvider";
import * as SecureStore from "expo-secure-store";
import StyleVariables from "@/constants/StyleVariables";

const PASSWORD_KEY = "nora_user_pin";

export default function AuthScreen() {
  const { isAuthenticated, isLoading, signIn } = useSession();
  const { showToast } = useToast();

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);
  const [storedPassword, setStoredPassword] = useState<string | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const colorScheme = useColorScheme();
  const colors = StyleVariables[colorScheme ?? "light"];
  const styles = getStyles(colors);

  // 1. Check Secure Storage beim Laden
  useEffect(() => {
    async function checkPassword() {
      try {
        const result = await SecureStore.getItemAsync(PASSWORD_KEY);
        if (!result) {
          // Kein Passwort gesetzt -> Sofort einloggen
          await signIn("noraUser");
          showToast("Automatisch angemeldet", "success");
        } else {
          setStoredPassword(result);
          setIsCheckingStorage(false);
        }
      } catch (e) {
        console.error("SecureStore Error", e);
        setIsCheckingStorage(false);
      }
    }
    checkPassword();
  }, []);

  // 2. Automatischer Login, wenn 6 Stellen gefüllt sind
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleLogin(otp.join(""));
    }
  }, [otp]);

  const handleOtpChange = (value: string, index: number) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    if (numericValue !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleLogin = async (enteredCode?: string) => {
    const codeToVerify = enteredCode || otp.join("");
    if (codeToVerify.length < 6) return;

    setIsLoadingSubmit(true);
    try {
      // Vergleich mit Passwort aus SecureStore
      if (codeToVerify === storedPassword) {
        await signIn("noraUser");
        showToast("Willkommen!", "success");
        router.replace("/(auth)/(tabs)");
      } else {
        showToast("Falscher Code", "error");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (e) {
      showToast("Fehler beim Login", "error");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  if (isLoading || isCheckingStorage) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(auth)/(tabs)" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>N</Text>

      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>Sicherer Zugang</Text>
        <Text style={styles.description}>
          Bitte gib deinen 6-stelligen Sicherheitscode ein.
        </Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(v) => handleOtpChange(v, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            // ref={(ref) => (inputRefs.current[index] = ref)}
            contextMenuHidden
            selectTextOnFocus
          />
        ))}
      </View>

      <TouchableOpacity
        onPress={() => handleLogin()}
        style={[styles.button, isLoadingSubmit && { opacity: 0.7 }]}
        disabled={isLoadingSubmit}
      >
        {isLoadingSubmit ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.buttonText}>VERIFIZIEREN</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors: typeof StyleVariables.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    icon: {
      fontSize: 40,
      color: colors.primary,
      backgroundColor: `${colors.primary}20`,
      borderRadius: 40,
      padding: 20,
      aspectRatio: 1,
      textAlign: "center",
      fontWeight: "bold",
      overflow: "hidden",
    },
    welcomeContainer: {
      alignItems: "center",
      marginVertical: 32,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      color: "#666",
      textAlign: "center",
      lineHeight: 22,
    },
    otpContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 40,
    },
    otpInput: {
      width: 45,
      height: 55,
      borderWidth: 2,
      borderColor: `${colors.primary}40`,
      borderRadius: 10,
      textAlign: "center",
      fontSize: 22,
      fontWeight: "bold",
      color: colors.primary,
    },
    button: {
      padding: 16,
      backgroundColor: `${colors.primary}20`,
      borderRadius: StyleVariables.borderRadius || 12,
      width: "100%",
    },
    buttonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      textTransform: "uppercase",
    },
  });