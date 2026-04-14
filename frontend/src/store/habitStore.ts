import { create } from "zustand";
import { Habit } from "../types/habit";

interface HabitStore {
  selectedHabit: Habit | null;
  setSelectedHabit: (habit: Habit | null) => void;
}

export const useHabitStore = create<HabitStore>((set) => ({
  selectedHabit: null,
  setSelectedHabit: (habit) => set({ selectedHabit: habit }),
}));
