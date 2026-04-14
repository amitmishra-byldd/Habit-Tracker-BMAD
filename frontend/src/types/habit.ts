export interface HabitInput {
  name: string;
  description?: string;
  category: "DSA" | "Projects" | "Learning" | "Other";
}
export interface Habit {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  category: "DSA" | "Projects" | "Learning" | "Other";
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
