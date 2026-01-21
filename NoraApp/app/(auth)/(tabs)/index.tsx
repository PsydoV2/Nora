import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import StyleVariables from "@/constants/StyleVariables";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2023/24");
  const colorScheme = useColorScheme();
  const colors = StyleVariables[colorScheme ?? "light"];
  const styles = getStyles(colors);

  // Dummy-Daten für die Optik
  const [subjects, setSubjects] = useState([
    { id: "1", name: "Mathematik", color: "#4A90E2", examsPerYear: 3 },
    { id: "2", name: "Deutsch", color: "#E35D5D", examsPerYear: 2 },
    { id: "3", name: "Englisch", color: "#50C878", examsPerYear: 2 },
  ]);

  return (
    <View style={styles.container}>
      {/* Header mit Dropdown-Bereich */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}></Text>
        <TouchableOpacity style={styles.yearDropdown}>
          <Text style={styles.yearText}>{selectedYear}</Text>
          <Octicons name="chevron-down" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {subjects.map((subject) => (
          <View key={subject.id} style={styles.subjectCard}>
            {/* Linkes Quadrat mit Anfangsbuchstaben */}
            <View
              style={[
                styles.subjectIcon,
                { backgroundColor: `${subject.color}40` },
              ]}
            >
              <Text style={[styles.subjectIconText, { color: subject.color }]}>
                {subject.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            {/* Mittlerer Bereich: Name und Notenfelder */}
            <View style={styles.subjectInfo}>
              <Text style={styles.subjectName}>{subject.name}</Text>
              <View style={styles.gradesRow}>
                {Array.from({ length: subject.examsPerYear }).map((_, i) => (
                  <View key={i} style={styles.gradeBox}>
                    <TextInput
                      placeholder="-"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={2}
                      style={styles.gradeInput}
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Octicons name="plus" size={28} color={colors.primary} />
      </TouchableOpacity>

      {/* Modal zum Hinzufügen */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Neues Fach hinzufügen</Text>

            <TextInput
              placeholder="Name des Fachs"
              style={styles.input}
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="Klausuren pro Jahr (z.B. 2)"
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Akzentfarbe</Text>
            <View style={styles.colorPicker}>
              {["#4A90E2", "#E35D5D", "#50C878", "#F5A623", "#9B59B6"].map(
                (c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.colorOption, { backgroundColor: `${c}` }]}
                  />
                )
              )}
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.addButtonText}>Hinzufügen</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
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
      backgroundColor: colors.bg,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "900",
    },
    yearDropdown: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.bg,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: StyleVariables.brMd,
      borderWidth: 1,
      borderColor: colors.borderMuted,
    },
    yearText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
      marginRight: 6,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 100,
    },
    subjectCard: {
      flexDirection: "row",
      borderRadius: StyleVariables.brLg,
      padding: 15,
      marginBottom: 12,
      alignItems: "center",
      backgroundColor: colors.bgLight,
    },
    subjectIcon: {
      width: 50,
      height: 50,
      borderRadius: StyleVariables.brMd,
      justifyContent: "center",
      alignItems: "center",
    },
    subjectIconText: {
      fontSize: 22,
      fontWeight: "bold",
    },
    subjectInfo: {
      flex: 1,
      marginLeft: StyleVariables.gapLg,
    },
    subjectName: {
      fontSize: 18,
      fontWeight: "800",
      marginBottom: StyleVariables.gapSm,
    },
    gradesRow: {
      flexDirection: "row",
    },
    gradeBox: {
      width: 35,
      height: 35,
      backgroundColor: colors.bg,
      borderRadius: StyleVariables.brSm,
      marginRight: StyleVariables.gapMd,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    gradeInput: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      width: "100%",
    },
    fab: {
      position: "absolute",
      bottom: 30,
      right: 30,
      width: 60,
      height: 60,
      borderRadius: StyleVariables.brLg,
      backgroundColor: `${colors.primary}40`,
      justifyContent: "center",
      alignItems: "center",
    },
    // Modal Styles
    modalBackdrop: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalView: {
      backgroundColor: "white",
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      padding: 30,
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "900",
      marginBottom: 20,
    },
    input: {
      width: "100%",
      backgroundColor: colors.bg,
      padding: 15,
      borderRadius: StyleVariables.brMd,
      marginBottom: 15,
      fontSize: 16,
    },
    label: {
      alignSelf: "flex-start",
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 10,
      opacity: 0.6,
    },
    colorPicker: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 25,
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    addButton: {
      backgroundColor: colors.primary,
      width: "100%",
      padding: 16,
      borderRadius: StyleVariables.brMd,
      alignItems: "center",
      marginBottom: 10,
    },
    addButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    closeButton: {
      padding: 10,
    },
    closeButtonText: {
      color: colors.danger,
      fontWeight: "700",
    },
  });
