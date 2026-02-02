export interface DTOSubject {
  uuid: string;
  subject: string;
  schoolyear: string;
  accentColor: string;
  gradeAmount: number;
  grades: (number | null)[];
  reportGradeAmount: number;
  reportGrades: (number | null)[];
  vocalGradeAmount: number;
  vocalGrades: (number | null)[];
}
