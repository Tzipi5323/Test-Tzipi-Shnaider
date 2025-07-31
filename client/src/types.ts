// טיפוס אחיד לפקודות ציור
export type DrawCommand =
  | { type: 'circle'; x: number; y: number; radius: number; color?: string }
  | { type: 'rect'; x: number; y: number; width: number; height: number; color?: string }
  | { type: 'line'; x1: number; y1: number; x2: number; y2: number; color?: string; width?: number }
  | { type: 'triangle'; points: [number, number, number, number, number, number]; color?: string };

// טיפוס אחיד למשתמש
export type User = {
  id: string;
  userName: string;
  password?: string; // אפשר גם עם סימן שאלה אם לא תמיד יש סיסמה
};
