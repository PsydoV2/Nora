import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface DTOSubject {
  uuid: string;
  subject: string;
  schoolyear: string;
  accentColor: string;
  gradeAmount: number;
  grades: (number | null)[];
}

interface SubjectContextType {
  subjects: DTOSubject[];
  addSubject: (subject: Omit<DTOSubject, "uuid">) => Promise<void>;
  updateGrade: (
    subjectUuid: string,
    gradeIndex: number,
    value: string
  ) => Promise<void>;
  loading: boolean;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

const STORAGE_KEY = "@grades_data_v1";

export const SubjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [subjects, setSubjects] = useState<DTOSubject[]>([]);
  const [loading, setLoading] = useState(true);

  // Daten beim Start laden
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) setSubjects(JSON.parse(jsonValue));
    } catch (e) {
      console.error("Fehler beim Laden:", e);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newList: DTOSubject[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      setSubjects(newList);
    } catch (e) {
      console.error("Fehler beim Speichern:", e);
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
    value: string
  ) => {
    const numericGrade =
      value === "" ? null : parseFloat(value.replace(",", "."));
    const newList = subjects.map((s) => {
      if (s.uuid === subjectUuid) {
        const newGrades = [...s.grades];
        newGrades[gradeIndex] = numericGrade;
        return { ...s, grades: newGrades };
      }
      return s;
    });
    await saveData(newList);
  };

  return (
    <SubjectContext.Provider
      value={{ subjects, addSubject, updateGrade, loading }}
    >
      {children}
    </SubjectContext.Provider>
  );
};

// Custom Hook für einfachen Zugriff
export const useSubjects = () => {
  const context = useContext(SubjectContext);
  if (!context)
    throw new Error(
      "useSubjects muss innerhalb eines SubjectProviders genutzt werden"
    );
  return context;
};
