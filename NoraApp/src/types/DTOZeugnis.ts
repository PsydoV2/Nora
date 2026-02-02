export interface DTOZeugnis {
  uuid: string;
  subject: string;
  schoolyear: string;
  accentColor: string;
  gradeAmount: number;
  grades: (number | null)[];
}
