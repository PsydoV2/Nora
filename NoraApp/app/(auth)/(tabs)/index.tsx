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
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import StyleVariables from "@/constants/StyleVariables";
import { useSubjects } from "@/src/context/SubjectContext";
import { DTOSubject } from "@/src/types/DTOSubjects";
import { BlurView } from "expo-blur";

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
  const [gradeAmount, setGradeAmount] = useState("");
  const [reportGradeAmount, setReportGradeAmount] = useState("");
  const [vocalGradeAmount, setVocalGradeAmount] = useState("");
  const [selectedColor, setSelectedColor] = useState("#4A90E2");

  const [activeFilter, setActiveFilter] = useState<
    "grade" | "vocal" | "report" | ""
  >("");
  const [activeFilterVis, setActiveFilterVis] = useState(false);

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
        {/* <Text style={styles.headerTitle}>nora</Text> */}
        <TouchableOpacity onPress={() => setActiveFilterVis(!activeFilterVis)}>
          <Text>
            {activeFilterVis ? (
              <MaterialIcons
                name="filter-list-off"
                size={24}
                color={colors.text}
              />
            ) : (
              <MaterialIcons name="filter-list" size={24} color={colors.text} />
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.yearDropdown}
          onPress={() => setYearModalVisible(true)}
        >
          <Text style={styles.yearText}>{selectedYear}</Text>
          <Octicons name="chevron-down" size={16} color={colors.text} />
        </TouchableOpacity>

        <View
          style={[
            styles.filterRow,
            activeFilterVis ? { display: "flex" } : { display: "none" },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.filterBtn,
              !activeFilter.match("grade") ? "" : styles.filterBtnActive,
            ]}
            onPress={() => handleActiveFilter("grade")}
          >
            <Text
              style={
                activeFilter.match("grade")
                  ? { color: colors.primary }
                  : { color: colors.text }
              }
            >
              Klausur
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              !activeFilter.match("report") ? "" : styles.filterBtnActive,
            ]}
            onPress={() => handleActiveFilter("report")}
          >
            <Text
              style={
                activeFilter.match("grade")
                  ? { color: colors.primary }
                  : { color: colors.text }
              }
            >
              Zeugnis
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              !activeFilter.match("vocal") ? "" : styles.filterBtnActive,
            ]}
            onPress={() => handleActiveFilter("vocal")}
          >
            <Text
              style={
                activeFilter.match("grade")
                  ? { color: colors.primary }
                  : { color: colors.text }
              }
            >
              Mündlich
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {(activeFilter == "" || activeFilter == "grade") && (
          <>
            <Text style={styles.subjectTitle}>Klausur</Text>
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
            <Text style={styles.subjectTitle}>Zeugnis</Text>
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
            <Text style={styles.subjectTitle}>Mündlich</Text>
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
              <Text
                style={[
                  styles.optionText,
                  { marginLeft: StyleVariables.gapLg },
                ]}
              >
                Bearbeiten
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionRow} onPress={handleDelete}>
              <Octicons name="trash" size={20} color="red" />
              <Text
                style={[
                  styles.optionText,
                  { color: "red", marginLeft: StyleVariables.gapLg },
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
        <BlurView style={styles.modalBackdrop} intensity={20}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalBackdrop}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Neues Fach</Text>
              <TextInput
                placeholder="Name des Fachs"
                style={styles.input}
                placeholderTextColor={colors.border}
                value={newSubjectName}
                onChangeText={setNewSubjectName}
                maxLength={16}
              />
              <TextInput
                placeholder="Anzahl Klausuren"
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor={colors.border}
                value={gradeAmount}
                onChangeText={setGradeAmount}
                maxLength={1}
              />
              <TextInput
                placeholder="Anzahl Zeugnisnoten"
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor={colors.border}
                value={reportGradeAmount}
                onChangeText={setReportGradeAmount}
                maxLength={1}
              />
              <TextInput
                placeholder="Anzahl Mündlichenoten"
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor={colors.border}
                value={vocalGradeAmount}
                onChangeText={setVocalGradeAmount}
                maxLength={1}
              />
              <View style={styles.colorPicker}>
                {["#4A90E2", "#E35D5D", "#50C878", "#F5A623", "#9B59B6"].map(
                  (c) => {
                    const isSelected = selectedColor === c;
                    return (
                      <TouchableOpacity
                        key={c}
                        onPress={() => setSelectedColor(c)}
                        activeOpacity={0.8}
                        style={[
                          styles.colorOption,
                          {
                            justifyContent: "center",
                            alignItems: "center",
                            width: 38,
                            height: 38,
                            borderRadius: 22,
                            borderWidth: isSelected ? 2 : 0,
                            borderColor: c,
                            backgroundColor: "transparent",
                          },
                        ]}
                      >
                        <View
                          style={{
                            width: isSelected ? 30 : 38,
                            height: isSelected ? 30 : 38,
                            borderRadius: 20,
                            backgroundColor: c,
                          }}
                        />
                      </TouchableOpacity>
                    );
                  },
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
        </BlurView>
      </Modal>
    </View>
  );
}

// Hier die getStyles Funktion (unverändert wie von dir geliefert)
const getStyles = (colors: (typeof StyleVariables)["light"]) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      paddingHorizontal: StyleVariables.gapLg,
      paddingTop: StyleVariables.gapLg * 3,
      paddingBottom: StyleVariables.gapLg,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "900",
      color: colors.primary,
      paddingHorizontal: StyleVariables.gapSm,
      paddingBottom: StyleVariables.gapLg,
    },
    filterRow: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      paddingTop: StyleVariables.gapLg * 2,
    },
    filterBtn: {
      backgroundColor: colors.bgDark,
      paddingVertical: StyleVariables.gapMd,
      paddingHorizontal: StyleVariables.gapLg,
      borderRadius: StyleVariables.brLg,
    },
    filterBtnActive: {
      backgroundColor: `${colors.primary}20`,
      color: colors.primary,
    },
    yearDropdown: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.bg,
      paddingHorizontal: StyleVariables.gapMd,
      paddingVertical: StyleVariables.gapMd,
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
    subjectTitle: {
      fontSize: 24,
      fontWeight: "900",
      color: colors.text,
      paddingHorizontal: StyleVariables.gapSm,
      paddingTop: StyleVariables.gapLg,
      marginBottom: StyleVariables.gapMd,
    },
    subjectCard: {
      flexDirection: "row",
      borderRadius: StyleVariables.brMd,
      paddingVertical: StyleVariables.gapMd,
      paddingHorizontal: StyleVariables.gapLg,
      marginBottom: StyleVariables.gapLg,
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
      borderRadius: StyleVariables.brSm,
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
      backgroundColor: "rgba(0, 0, 0, 0.4)",
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
      paddingVertical: StyleVariables.gapMd,
      paddingHorizontal: StyleVariables.gapLg,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: StyleVariables.gapLg,
    },
    optionText: { fontSize: 18, fontWeight: "600", color: colors.text },
    input: {
      width: "100%",
      backgroundColor: colors.bgDark,
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
      backgroundColor: `${colors.primary}40`,
      width: "100%",
      paddingVertical: StyleVariables.gapLg,
      paddingHorizontal: StyleVariables.gapSm,
      borderRadius: StyleVariables.brMd,
      alignItems: "center",
      marginBottom: StyleVariables.gapMd,
    },
    addButtonText: { color: colors.primary, fontWeight: "900", fontSize: 16 },
    closeButton: {
      marginTop: StyleVariables.gapSm,
      padding: StyleVariables.gapSm,
    },
    closeButtonText: {
      color: "red",
      fontWeight: "700",
      fontSize: 16,
    },
  });
