import axios from "axios";
import { Habit } from "../types/habit";

export interface HabitInput {
  name: string;
  description?: string;
  category: "DSA" | "Projects" | "Learning" | "Other";
}

export async function fetchHabits() {
  const res = await axios.get<Habit[]>("/api/habits", {
    withCredentials: true,
  });
  return res.data;
}

export async function createHabit(input: HabitInput) {
  const res = await axios.post<Habit>("/api/habits", input, {
    withCredentials: true,
  });
  return res.data;
}

export async function updateHabit(id: string, input: Partial<HabitInput>) {
  const res = await axios.patch<Habit>(`/api/habits/${id}`, input, {
    withCredentials: true,
  });
  return res.data;
}

export async function archiveHabit(id: string, archive = true) {
  const res = await axios.patch<Habit>(
    `/api/habits/${id}/archive`,
    { archive },
    { withCredentials: true },
  );
  return res.data;
}

export async function deleteHabit(id: string) {
  const res = await axios.delete(`/api/habits/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
