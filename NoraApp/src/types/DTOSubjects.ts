export interface DTOSubject {
  uuid: string; // String ist flexibler für echte UUIDs
  subject: string;
  schoolyear: string;
  accentColor: string;
  gradeAmount: number;
  grades: (number | null)[]; // Erlaubt leere Felder (null), wenn noch keine Note eingetragen ist
}
