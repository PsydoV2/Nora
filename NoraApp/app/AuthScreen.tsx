import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  useColorScheme,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import { Redirect, router } from "expo-router";
import * as SecureStore from "expo-secure-store";

// Eigene Komponenten & Context
import { Text } from "@/components/Themed";
import { useSession } from "@/src/context/AuthContext";
import { useToast } from "@/src/context/ToastProvider";
import StyleVariables from "@/constants/StyleVariables";

// --- KONSTANTEN ---
const PASSWORD_KEY = "nora_user_pin";
const OTP_LENGTH = 6;

export default function AuthScreen() {
  // --- HOOKS & CONTEXT ---
  const { isAuthenticated, isLoading, signIn } = useSession();
  const { showToast } = useToast();
  const colorScheme = useColorScheme();
  const colors = StyleVariables[colorScheme ?? "light"];
  const styles = getStyles(colors);

  // --- STATE ---
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);
  const [storedPassword, setStoredPassword] = useState<string | null>(null);

  // OTP State: Array mit 6 leeren Strings
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));
  // Aktives Eingabefeld für visuelles Highlighting
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);

  // --- REFS ---
  // Refs für den automatischen Fokus-Wechsel zwischen den Feldern
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // --- INITIALISIERUNG ---
  /**
   * Prüft beim Start, ob ein Passwort im SecureStore hinterlegt ist.
   * Fall 1: Kein PW -> User wird sofort eingeloggt (Ersteinrichtung oder kein Schutz).
   * Fall 2: PW existiert -> User muss PIN eingeben.
   */
  useEffect(() => {
    async function checkPassword() {
      try {
        const result = await SecureStore.getItemAsync(PASSWORD_KEY);

        if (!result) {
          // Szenario: Kein PIN gesetzt -> Auto-Login
          await signIn("noraUser");
          router.replace("/(auth)/(tabs)");
          showToast("Automatisch angemeldet", "success");
        } else {
          // Szenario: PIN vorhanden -> Speichern für Vergleich
          setStoredPassword(result);
          setIsCheckingStorage(false);
        }
      } catch (e) {
        console.error("SecureStore Error", e);
        showToast("Fehler beim Laden der Sicherheitsdaten", "error");
        setIsCheckingStorage(false);
      }
    }
    checkPassword();
  }, []);

  // --- AUTO-SUBMIT EFFEKT ---
  /**
   * Überwacht das OTP-Array. Wenn alle Felder gefüllt sind,
   * wird automatisch der Login-Prozess ausgelöst.
   */
  useEffect(() => {
    const isOtpComplete = otp.every((digit) => digit !== "");
    if (isOtpComplete) {
      handleLogin(otp.join(""));
    }
  }, [otp]);

  // --- HANDLER FUNCTIONS ---

  /**
   * Verarbeitet die Eingabe einer Ziffer.
   * - Erlaubt nur Zahlen.
   * - Springt automatisch zum nächsten Feld.
   */
  const handleOtpChange = (value: string, index: number) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    // Wenn Zahl eingegeben wurde und wir nicht im letzten Feld sind -> Fokus weiter
    if (numericValue !== "" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Behandelt spezielle Tasten (z.B. Backspace).
   * - Bei Backspace im leeren Feld: Springt zum vorherigen Feld zurück.
   */
  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
      // Optional: Lösche den Wert im vorherigen Feld direkt beim Zurückspringen
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
  };

  /**
   * Überprüft den eingegebenen Code gegen das gespeicherte Passwort.
   */
  const handleLogin = async (enteredCode?: string) => {
    const codeToVerify = enteredCode || otp.join("");

    // Sicherheit: Nicht absenden, wenn Code unvollständig
    if (codeToVerify.length < OTP_LENGTH) return;

    setIsLoadingSubmit(true);
    try {
      if (codeToVerify === storedPassword) {
        await signIn("noraUser");
        showToast("Willkommen!", "success");
        router.replace("/(auth)/(tabs)");
      } else {
        // Fehlerfall: Falscher Code
        showToast("Falscher Code", "error");
        triggerShakeAnimation(); // Platzhalter für Animation
        resetOtp();
      }
    } catch (e) {
      showToast("Fehler beim Login", "error");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  /**
   * Setzt die Eingabefelder zurück und fokussiert das erste Feld.
   */
  const resetOtp = () => {
    setOtp(new Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
    setFocusedIndex(0);
  };

  // Platzhalter für eine optionale visuelle Fehler-Animation
  const triggerShakeAnimation = () => {
    // Hier könnte Logik für Reanimated o.ä. stehen
  };

  // --- RENDER HELPERS ---

  if (isCheckingStorage) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.danger} />
      </View>
    );
  }

  // --- MAIN RENDER ---
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Logo / Header Icon */}
      <Text style={styles.icon}>NR</Text>

      {/* Begrüßungstext */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>Willkommen zurück!</Text>
        <Text style={styles.description}>
          Bitte gib deinen {OTP_LENGTH}-stelligen Sicherheitscode ein.
        </Text>
      </View>

      {/* OTP Eingabefelder */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={[
              styles.otpInput,
              focusedIndex === index && styles.otpInputFocused,
            ]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(v) => handleOtpChange(v, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            contextMenuHidden
            selectTextOnFocus
            importantForAutofill="no"
          />
        ))}
      </View>

      {/* Verify Button */}
      <TouchableOpacity
        onPress={() => handleLogin()}
        style={[styles.button, isLoadingSubmit && styles.buttonDisabled]}
        disabled={isLoadingSubmit}
        activeOpacity={0.8}
      >
        {isLoadingSubmit ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.buttonText}>VERIFIZIEREN</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

// --- STYLES ---
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
    // Header & Icon
    icon: {
      fontSize: 50,
      color: colors.primary,
      backgroundColor: `${colors.primary}20`,
      borderRadius: StyleVariables.brLg,
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
    // OTP Inputs
    otpContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      maxWidth: 400, // Begrenzung für Tablets
      marginBottom: 40,
    },
    otpInput: {
      width: 45,
      height: 55,
      borderWidth: 2,
      borderColor: `${colors.primary}20`,
      borderRadius: StyleVariables.brSm,
      textAlign: "center",
      fontSize: 22,
      fontWeight: "bold",
      color: colors.primary,
      backgroundColor: "transparent", // Explizit transparent
    },
    otpInputFocused: {
      borderColor: colors.primary, // Volle Farbe bei Fokus
      backgroundColor: `${colors.primary}05`, // Leichter Hintergrund bei Fokus
    },
    // Button
    button: {
      padding: 16,
      backgroundColor: `${colors.primary}20`,
      borderRadius: StyleVariables.brLg,
      width: "100%",
      maxWidth: 400,
      alignItems: "center", // Zentriert den Text/Loader
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      textTransform: "uppercase",
    },
  });
