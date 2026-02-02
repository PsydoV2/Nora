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
import { useSubjects } from "@/src/context/SubjectContext";
import { DTOSubject } from "@/src/types/DTOSubjects";

export default function Home() {
  const colorScheme = useColorScheme();
  const colors = StyleVariables[colorScheme ?? "light"];
  const styles = getStyles(colors);
  const { addSubject, subjects, updateGrade, deleteSubject } = useSubjects();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);

  const [selectedYear, setSelectedYear] = useState("2025/26");
  const [activeSubject, setActiveSubject] = useState<DTOSubject | null>(null);

  const [newSubjectName, setNewSubjectName] = useState("");
  const [gradeAmount, setGradeAmount] = useState("2");
  const [reportGradeAmount, setReportGradeAmount] = useState("2");
  const [vocalGradeAmount, setVocalGradeAmount] = useState("2");
  const [selectedColor, setSelectedColor] = useState("#4A90E2");

  const [activeFilter, setActiveFilter] = useState<
    "grade" | "vocal" | "report" | ""
  >("");

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
    (s) => s.schoolyear === selectedYear,
  );

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) return;
    const amount = parseInt(gradeAmount) || 0;
    const rAmount = parseInt(reportGradeAmount) || 0;
    const vAmount = parseInt(vocalGradeAmount) || 0;

    await addSubject({
      subject: newSubjectName,
      schoolyear: selectedYear,
      accentColor: selectedColor,
      gradeAmount: amount,
      grades: Array(amount).fill(null),
      reportGradeAmount: rAmount,
      reportGrades: Array(rAmount).fill(null),
      vocalGradeAmount: vAmount,
      vocalGrades: Array(vAmount).fill(null),
    });

    setNewSubjectName("");
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

  const handleActiveFilter = (type: "grade" | "vocal" | "report") => {
    if (activeFilter === type) {
      setActiveFilter("");
    } else {
      setActiveFilter(type);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text style={styles.headerTitle}></Text> */}
        <TouchableOpacity
          style={styles.yearDropdown}
          onPress={() => setYearModalVisible(true)}
        >
          <Text style={styles.yearText}>{selectedYear}</Text>
          <Octicons name="chevron-down" size={16} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              !activeFilter.match("grade") ? { borderWidth: 0 } : "",
            ]}
            onPress={() => handleActiveFilter("grade")}
          >
            <Text>Klausur</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              !activeFilter.match("report") ? { borderWidth: 0 } : "",
            ]}
            onPress={() => handleActiveFilter("report")}
          >
            <Text>Zeugnis</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              !activeFilter.match("vocal") ? { borderWidth: 0 } : "",
            ]}
            onPress={() => handleActiveFilter("vocal")}
          >
            <Text>Mündlich</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {(activeFilter == "" || activeFilter == "grade") && (
          <>
            <Text style={styles.headerTitle}>Klausur</Text>
            {subjectsCurrentYear.length === 0 && (
              <Text style={styles.emptyText}>Keine Einträge bisher</Text>
            )}
            {subjectsCurrentYear.map((subject) => (
              <View key={`exam-${subject.uuid}`} style={styles.subjectCard}>
                <View
                  style={[
                    styles.subjectIcon,
                    { backgroundColor: `${subject.accentColor}40` },
                  ]}
                >
                  <Text
                    style={[
                      styles.subjectIconText,
                      { color: subject.accentColor },
                    ]}
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
                          onChangeText={(val) =>
                            updateGrade(subject.uuid, i, val, false)
                          }
                        />
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {(activeFilter == "" || activeFilter == "report") && (
          <>
            <Text style={styles.headerTitle}>Zeugnis</Text>
            {subjectsCurrentYear.length === 0 && (
              <Text style={styles.emptyText}>Keine Einträge bisher</Text>
            )}
            {subjectsCurrentYear.map((subject) => (
              <View key={`report-${subject.uuid}`} style={styles.subjectCard}>
                <View
                  style={[
                    styles.subjectIcon,
                    { backgroundColor: `${subject.accentColor}40` },
                  ]}
                >
                  <Text
                    style={[
                      styles.subjectIconText,
                      { color: subject.accentColor },
                    ]}
                  >
                    {subject.subject.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.subjectInfo}>
                  <View style={styles.subjectHeaderRow}>
                    <Text style={[styles.subjectName, { color: colors.text }]}>
                      {subject.subject}
                    </Text>
                  </View>

                  <View style={styles.gradesRow}>
                    {(subject.reportGrades || []).map((grade, i) => (
                      <View key={i} style={styles.gradeBox}>
                        <TextInput
                          placeholder="-"
                          placeholderTextColor={colors.textMuted}
                          keyboardType="numeric"
                          style={styles.gradeInput}
                          value={grade?.toString() || ""}
                          onChangeText={(val) =>
                            updateGrade(subject.uuid, i, val, true)
                          }
                        />
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {(activeFilter == "" || activeFilter == "vocal") && (
          <>
            <Text style={styles.headerTitle}>Mündlich</Text>
            {subjectsCurrentYear.length === 0 && (
              <Text style={styles.emptyText}>Keine Einträge bisher</Text>
            )}
            {subjectsCurrentYear.map((subject) => (
              <View key={`report-${subject.uuid}`} style={styles.subjectCard}>
                <View
                  style={[
                    styles.subjectIcon,
                    { backgroundColor: `${subject.accentColor}40` },
                  ]}
                >
                  <Text
                    style={[
                      styles.subjectIconText,
                      { color: subject.accentColor },
                    ]}
                  >
                    {subject.subject.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.subjectInfo}>
                  <View style={styles.subjectHeaderRow}>
                    <Text style={[styles.subjectName, { color: colors.text }]}>
                      {subject.subject}
                    </Text>
                  </View>

                  <View style={styles.gradesRow}>
                    {(subject.reportGrades || []).map((grade, i) => (
                      <View key={i} style={styles.gradeBox}>
                        <TextInput
                          placeholder="-"
                          placeholderTextColor={colors.textMuted}
                          keyboardType="numeric"
                          style={styles.gradeInput}
                          value={grade?.toString() || ""}
                          onChangeText={(val) =>
                            updateGrade(subject.uuid, i, val, true)
                          }
                        />
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

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
            <Text style={styles.modalTitle}>Neues Fach</Text>
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
            <TextInput
              placeholder="Anzahl Zeugnisnoten"
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#999"
              value={reportGradeAmount}
              onChangeText={setReportGradeAmount}
            />
            <TextInput
              placeholder="Anzahl Mündlichenoten"
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#999"
              value={reportGradeAmount}
              onChangeText={setReportGradeAmount}
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
                ),
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

      {/* Hier folgen die anderen Modals (Year & Menu) - Code ist identisch zu deinem Original */}
    </View>
  );
}

// Hier die getStyles Funktion (unverändert wie von dir geliefert)
const getStyles = (colors: (typeof StyleVariables)["light"]) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      flexWrap: "wrap",
      paddingHorizontal: StyleVariables.gapLg,
      paddingTop: 60,
      marginBottom: -30,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "900",
      color: colors.text,
      paddingHorizontal: StyleVariables.gapSm,
      paddingBottom: StyleVariables.gapLg,
      marginTop: StyleVariables.gapLg,
    },
    filterRow: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      height: 100,
    },
    filterBtn: {
      backgroundColor: colors.bgDark,
      paddingVertical: StyleVariables.gapMd,
      paddingHorizontal: StyleVariables.gapLg,
      borderRadius: StyleVariables.brLg,
      borderColor: colors.primary,
      borderWidth: StyleSheet.hairlineWidth,
    },
    yearDropdown: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.bg,
      paddingHorizontal: StyleVariables.gapMd,
      paddingVertical: StyleVariables.gapSm,
      borderRadius: StyleVariables.brMd,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    yearText: {
      fontSize: 14,
      fontWeight: "900",
      color: colors.text,
      marginRight: StyleVariables.gapMd,
    },
    scrollContent: {
      paddingHorizontal: StyleVariables.gapLg,
      paddingBottom: 100,
    },
    emptyText: {
      color: colors.textMuted,
      textAlign: "center",
      marginBottom: StyleVariables.gapLg,
    },
    subjectCard: {
      flexDirection: "row",
      borderRadius: StyleVariables.brLg,
      padding: StyleVariables.gapMd,
      marginBottom: StyleVariables.gapMd,
      alignItems: "center",
      backgroundColor: colors.bgLight,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      width: "100%",
      height: 100,
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
    menuTrigger: { padding: StyleVariables.gapSm },
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
      paddingBottom: 6,
    },
    fab: {
      position: "absolute",
      bottom: StyleVariables.gapLg,
      right: StyleVariables.gapLg,
      width: 60,
      height: 60,
      borderRadius: StyleVariables.brLg,
      backgroundColor: `${colors.primary}20`,
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
      padding: StyleVariables.gapLg,
      alignItems: "center",
      width: "100%",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "900",
      marginBottom: StyleVariables.gapLg,
      color: colors.text,
    },
    optionRow: {
      width: "100%",
      paddingVertical: StyleVariables.gapLg,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    optionText: { fontSize: 18, fontWeight: "600", color: colors.text },
    input: {
      width: "100%",
      backgroundColor: colors.bg,
      padding: StyleVariables.gapLg,
      borderRadius: StyleVariables.brMd,
      marginBottom: StyleVariables.gapLg,
      fontSize: 16,
      color: colors.text,
    },
    colorPicker: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: StyleVariables.gapLg,
    },
    colorOption: { width: 40, height: 40, borderRadius: 1000 },
    addButton: {
      backgroundColor: colors.primary,
      width: "100%",
      padding: 16,
      borderRadius: StyleVariables.brMd,
      alignItems: "center",
      marginBottom: 10,
    },
    addButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
    closeButton: {
      marginTop: StyleVariables.gapSm,
      padding: StyleVariables.gapSm,
    },
    closeButtonText: { color: colors.danger, fontWeight: "700", fontSize: 16 },
  });
