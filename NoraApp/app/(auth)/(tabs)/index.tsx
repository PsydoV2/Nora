import React, { useState, useMemo } from "react";
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
import { DTOSubject, useSubjects } from "@/src/context/SubjectContext";

export default function Home() {
  const colorScheme = useColorScheme();
  const colors = StyleVariables[colorScheme ?? "light"];
  const styles = getStyles(colors);
  const { addSubject, subjects, updateGrade, deleteSubject } = useSubjects();

  // Modals Visibility
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);

  // States
  const [selectedYear, setSelectedYear] = useState("2025/26");
  const [activeSubject, setActiveSubject] = useState<DTOSubject | null>(null);

  // States für neues Fach
  const [newSubjectName, setNewSubjectName] = useState("");
  const [gradeAmount, setGradeAmount] = useState("2");
  const [selectedColor, setSelectedColor] = useState("#4A90E2");

  // Schuljahr-Logik: Heute bis 15 Jahre zurück
  const availableYears = useMemo(() => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 16; i++) {
      const year = currentYear - i;
      years.push(`${year - 1}/${year.toString().slice(-2)}`);
    }
    return years;
  }, []);

  const subjectsCurrentYear = subjects.filter(
    (s) => s.schoolyear === selectedYear
  );

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) return;
    const amount = parseInt(gradeAmount) || 0;
    await addSubject({
      subject: newSubjectName,
      schoolyear: selectedYear,
      accentColor: selectedColor,
      gradeAmount: amount,
      grades: Array(amount).fill(null),
    });
    setNewSubjectName("");
    setGradeAmount("2");
    setAddModalVisible(false);
  };

  const openMenu = (subject: DTOSubject) => {
    setActiveSubject(subject);
    setMenuModalVisible(true);
  };

  const handleDelete = async () => {
    if (activeSubject) {
      await deleteSubject(activeSubject.uuid);
      setMenuModalVisible(false);
      setActiveSubject(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}></Text>
        <TouchableOpacity
          style={styles.yearDropdown}
          onPress={() => setYearModalVisible(true)}
        >
          <Text style={styles.yearText}>{selectedYear}</Text>
          <Octicons name="chevron-down" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Liste */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {subjectsCurrentYear.length == 0 && (
          <Text style={styles.emptyText}>Keine Einträge bisher</Text>
          // TODO Möglichkeit einbauen Subjects aus letztem Jahr zu kopieren
        )}
        {subjectsCurrentYear.map((subject) => (
          <View key={subject.uuid} style={styles.subjectCard}>
            <View
              style={[
                styles.subjectIcon,
                { backgroundColor: `${subject.accentColor}40` },
              ]}
            >
              <Text
                style={[styles.subjectIconText, { color: subject.accentColor }]}
              >
                {subject.subject.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.subjectInfo}>
              <View style={styles.subjectHeaderRow}>
                <Text style={[styles.subjectName, { color: colors.text }]}>
                  {subject.subject}
                </Text>
                <TouchableOpacity
                  onPress={() => openMenu(subject)}
                  style={styles.menuTrigger}
                >
                  <Octicons
                    name="kebab-horizontal"
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.gradesRow}>
                {subject.grades.map((grade, i) => (
                  <View key={i} style={styles.gradeBox}>
                    <TextInput
                      placeholder="-"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="numeric"
                      maxLength={2}
                      style={styles.gradeInput}
                      value={grade?.toString() || ""}
                      onChangeText={(val) => updateGrade(subject.uuid, i, val)}
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setAddModalVisible(true)}
      >
        <Octicons name="plus" size={28} color={colors.primary} />
      </TouchableOpacity>

      {/* Modal: Schuljahr wählen */}
      <Modal visible={yearModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setYearModalVisible(false)}
        >
          <View style={[styles.modalView, { maxHeight: "60%" }]}>
            <Text style={styles.modalTitle}>Schuljahr wählen</Text>
            <ScrollView style={{ width: "100%" }}>
              {availableYears.map((y) => (
                <TouchableOpacity
                  key={y}
                  style={styles.optionRow}
                  onPress={() => {
                    setSelectedYear(y);
                    setYearModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          selectedYear === y ? colors.primary : colors.text,
                      },
                    ]}
                  >
                    {y}
                  </Text>
                  {selectedYear === y && (
                    <Octicons name="check" size={18} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal: Fach-Optionen (Edit/Delete) */}
      <Modal visible={menuModalVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setMenuModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{activeSubject?.subject}</Text>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => {
                /* Edit Logik */
              }}
            >
              <Octicons name="pencil" size={20} color={colors.text} />
              <Text style={[styles.optionText, { marginLeft: 15 }]}>
                Bearbeiten
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionRow} onPress={handleDelete}>
              <Octicons name="trash" size={20} color={colors.danger} />
              <Text
                style={[
                  styles.optionText,
                  { color: colors.danger, marginLeft: 15 },
                ]}
              >
                Löschen
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMenuModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal: Hinzufügen */}
      <Modal visible={addModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Neues Fach ({selectedYear})</Text>
            <TextInput
              placeholder="Name des Fachs"
              style={styles.input}
              placeholderTextColor="#999"
              value={newSubjectName}
              onChangeText={setNewSubjectName}
            />
            <TextInput
              placeholder="Anzahl Klausuren"
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#999"
              value={gradeAmount}
              onChangeText={setGradeAmount}
            />
            <View style={styles.colorPicker}>
              {["#4A90E2", "#E35D5D", "#50C878", "#F5A623", "#9B59B6"].map(
                (c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setSelectedColor(c)}
                    style={[
                      styles.colorOption,
                      {
                        backgroundColor: c,
                        borderWidth: selectedColor === c ? 3 : 0,
                        borderColor: colors.text,
                      },
                    ]}
                  />
                )
              )}
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddSubject}
            >
              <Text style={styles.addButtonText}>Hinzufügen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setAddModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const getStyles = (colors: typeof StyleVariables.dark) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
    },
    headerTitle: { fontSize: 28, fontWeight: "900", color: colors.text },
    yearDropdown: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.bg,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: StyleVariables.brMd,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    yearText: {
      fontSize: 14,
      fontWeight: "900",
      color: colors.text,
      marginRight: 6,
    },
    scrollContent: {
      paddingHorizontal: StyleVariables.gapLg,
      paddingBottom: 100,
    },
    emptyText: {
      color: colors.textMuted,
      textAlign: "center",
    },
    subjectCard: {
      flexDirection: "row",
      borderRadius: StyleVariables.brLg,
      padding: StyleVariables.gapMd,
      marginBottom: 12,
      alignItems: "center",
      backgroundColor: colors.bgLight,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    subjectIcon: {
      width: 50,
      height: 50,
      borderRadius: StyleVariables.brMd,
      justifyContent: "center",
      alignItems: "center",
    },
    subjectIconText: { fontSize: 22, fontWeight: "bold" },
    subjectInfo: { flex: 1, marginLeft: StyleVariables.gapLg },
    subjectHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: StyleVariables.gapSm,
    },
    subjectName: { fontSize: 18, fontWeight: "800" },
    menuTrigger: { padding: 5 },
    gradesRow: { flexDirection: "row" },
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
      paddingBottom: StyleVariables.gapMd,
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
    modalBackdrop: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: `${"#000000"}20`,
    },
    modalView: {
      backgroundColor: colors.bgLight,
      borderTopLeftRadius: StyleVariables.brLg,
      borderTopRightRadius: StyleVariables.brLg,
      padding: 30,
      alignItems: "center",
      width: "100%",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "900",
      marginBottom: 20,
      color: colors.text,
    },
    optionRow: {
      width: "100%",
      paddingVertical: 18,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    optionText: { fontSize: 18, fontWeight: "600", color: colors.text },
    input: {
      width: "100%",
      backgroundColor: colors.bg,
      padding: 16,
      borderRadius: StyleVariables.brMd,
      marginBottom: 15,
      fontSize: 16,
      color: colors.text,
    },
    colorPicker: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 25,
    },
    colorOption: { width: 40, height: 40, borderRadius: 20 },
    addButton: {
      backgroundColor: colors.primary,
      width: "100%",
      padding: 16,
      borderRadius: StyleVariables.brMd,
      alignItems: "center",
      marginBottom: 10,
    },
    addButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
    closeButton: { marginTop: 10, padding: 10 },
    closeButtonText: { color: colors.danger, fontWeight: "700", fontSize: 16 },
  });
