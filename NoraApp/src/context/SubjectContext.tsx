import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DTOSubject } from "../types/DTOSubjects";

interface SubjectContextType {
  subjects: DTOSubject[];
  addSubject: (subject: Omit<DTOSubject, "uuid">) => Promise<void>;
  updateGrade: (
    subjectUuid: string,
    gradeIndex: number,
    value: string,
    isReport?: boolean,
  ) => Promise<void>;
  deleteSubject: (uuid: string) => Promise<void>;
  deleteAllData: () => Promise<void>;
  loading: boolean;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);
const STORAGE_KEY = "@grades_data_v1";

export const SubjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [subjects, setSubjects] = useState<DTOSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) setSubjects(JSON.parse(jsonValue));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newList: DTOSubject[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      setSubjects(newList);
    } catch (e) {
      console.error(e);
    }
  };

  const addSubject = async (sub: Omit<DTOSubject, "uuid">) => {
    const newSubject: DTOSubject = {
      ...sub,
      uuid: Math.random().toString(36).substring(7),
    };
    await saveData([...subjects, newSubject]);
  };

  const updateGrade = async (
    subjectUuid: string,
    gradeIndex: number,
    value: string,
    isReport: boolean = false,
  ) => {
    const numericGrade =
      value === "" ? null : parseFloat(value.replace(",", "."));
    const newList = subjects.map((s) => {
      if (s.uuid === subjectUuid) {
        if (isReport) {
          const newReportGrades = [...s.reportGrades];
          newReportGrades[gradeIndex] = numericGrade;
          return { ...s, reportGrades: newReportGrades };
        } else {
          const newGrades = [...s.grades];
          newGrades[gradeIndex] = numericGrade;
          return { ...s, grades: newGrades };
        }
      }
      return s;
    });
    await saveData(newList);
  };

  const deleteSubject = async (uuid: string) => {
    await saveData(subjects.filter((s) => s.uuid !== uuid));
  };

  const deleteAllData = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setSubjects([]);
  };

  return (
    <SubjectContext.Provider
      value={{
        subjects,
        addSubject,
        updateGrade,
        loading,
        deleteSubject,
        deleteAllData,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubjects = () => {
  const context = useContext(SubjectContext);
  if (!context)
    throw new Error("useSubjects must be used within a SubjectProvider");
  return context;
};
