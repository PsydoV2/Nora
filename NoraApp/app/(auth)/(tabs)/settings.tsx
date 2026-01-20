import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Switch,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Text } from "@/components/Themed";
import { useToast } from "@/src/context/ToastProvider";
import StyleVariables from "@/constants/StyleVariables";
import Octicons from "@expo/vector-icons/Octicons";

const PASSWORD_KEY = "nora_user_pin";
const OTP_LENGTH = 6;

export default function SettingsScreen() {
  const { showToast } = useToast();
  const colorScheme = useColorScheme();
  const colors = StyleVariables[colorScheme ?? "light"];
  const styles = getStyles(colors);

  const [isPinEnabled, setIsPinEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState<
    "off-confirm" | "on-enter" | "on-confirm"
  >("on-enter");
  const [tempPin, setTempPin] = useState("");

  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const checkPinStatus = async () => {
      try {
        const pin = await SecureStore.getItemAsync(PASSWORD_KEY);
        setIsPinEnabled(pin !== null);
      } catch (error) {
        console.error("SecureStore Error", error);
        showToast("Fehler beim Prüfen des PIN-Status", "error");
      } finally {
        setIsLoading(false);
      }
    };
    checkPinStatus();
  }, []);

  const handlePinToggle = (value: boolean) => {
    resetOtp();
    if (value) {
      setModalStep("on-enter");
      setModalVisible(true);
    } else {
      setModalStep("off-confirm");
      setModalVisible(true);
    }
  };

  const resetOtp = () => {
    setOtp(new Array(OTP_LENGTH).fill(""));
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
    setFocusedIndex(0);
  };

  const handleOtpChange = (value: string, index: number) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    if (numericValue !== "" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    const enteredPin = otp.join("");
    if (enteredPin.length === OTP_LENGTH) {
      handlePinSubmit(enteredPin);
    }
  }, [otp, modalStep]);

  const handlePinSubmit = async (pin: string) => {
    if (modalStep === "on-enter") {
      setTempPin(pin);
      setModalStep("on-confirm");
      resetOtp();
    } else if (modalStep === "on-confirm") {
      if (pin === tempPin) {
        await SecureStore.setItemAsync(PASSWORD_KEY, pin);
        showToast("PIN erfolgreich gesetzt!", "success");
        setIsPinEnabled(true);
        closeModal();
      } else {
        showToast("PINs stimmen nicht überein.", "error");
        setModalStep("on-enter");
        setTempPin("");
        resetOtp();
      }
    } else if (modalStep === "off-confirm") {
      const storedPin = await SecureStore.getItemAsync(PASSWORD_KEY);
      if (pin === storedPin) {
        await SecureStore.deleteItemAsync(PASSWORD_KEY);
        showToast("PIN erfolgreich entfernt!", "success");
        setIsPinEnabled(false);
        closeModal();
      } else {
        showToast("Falscher PIN.", "error");
        resetOtp();
      }
    }
  };

  const getModalTitle = () => {
    switch (modalStep) {
      case "on-enter":
        return "Neuen PIN festlegen";
      case "on-confirm":
        return "PIN bestätigen";
      case "off-confirm":
        return "Aktuellen PIN eingeben";
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    resetOtp();
    setTempPin("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <Text style={styles.settingText}>App mit PIN sperren</Text>
        {isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Switch
            value={isPinEnabled}
            onValueChange={handlePinToggle}
            trackColor={{
              false: colors.borderMuted,
              true: `${colors.primary}80`,
            }}
            thumbColor={isPinEnabled ? colors.primary : colors.border}
          />
        )}
      </View>

      <TouchableOpacity style={[styles.settingRow, styles.dangerRow]}>
        <Text style={[styles.settingText, { color: "red" }]}>
          Daten löschen
        </Text>
        <Octicons name="repo-deleted" size={24} color="red" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{getModalTitle()}</Text>
            <Text style={styles.modalDescription}>
              Bitte gib den 6-stelligen PIN ein.
            </Text>
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
                  secureTextEntry
                  autoFocus={index === 0 && modalVisible}
                  contextMenuHidden
                  selectTextOnFocus
                />
              ))}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const getStyles = (colors: typeof StyleVariables.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingVertical: 50,
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.bg,
      paddingHorizontal: 10,
    },
    settingText: {
      fontSize: 16,
      fontWeight: "900",
    },
    modalBackdrop: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
      backgroundColor: colors.bgDark,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
    modalDescription: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      marginBottom: 24,
      textAlign: "center",
    },
    closeButton: { marginTop: 20, padding: 10 },
    closeButtonText: {
      color: colors.primary,
      fontWeight: "bold",
      fontSize: 16,
    },
    otpContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      maxWidth: 350,
      marginBottom: 20,
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
      backgroundColor: "transparent",
    },
    otpInputFocused: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}05`,
    },
    dangerRow: {
      backgroundColor: `${colors.danger}20`,
      borderRadius: StyleVariables.brMd,
    },
  });
