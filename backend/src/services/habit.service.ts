import { Habit, IHabit } from "../models/Habit";
import { Types } from "mongoose";

export async function createHabit(data: Partial<IHabit>) {
  return Habit.create(data);
}

export async function getHabitsByUser(userId: Types.ObjectId) {
  return Habit.find({ userId, isArchived: false }).sort({ createdAt: -1 });
}

export async function updateHabit(
  habitId: string,
  userId: Types.ObjectId,
  updates: Partial<IHabit>,
) {
  return Habit.findOneAndUpdate(
    { _id: habitId, userId },
    { $set: updates },
    { new: true },
  );
}

export async function archiveHabit(
  habitId: string,
  userId: Types.ObjectId,
  archive = true,
) {
  return Habit.findOneAndUpdate(
    { _id: habitId, userId },
    { $set: { isArchived: archive } },
    { new: true },
  );
}

export async function deleteHabit(habitId: string, userId: Types.ObjectId) {
  return Habit.findOneAndDelete({ _id: habitId, userId });
}
