import { Request, Response } from "express";
import * as habitService from "../services/habit.service";
import { z } from "zod";

const habitSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.enum(["DSA", "Projects", "Learning", "Other"]).default("Other"),
});

export async function createHabit(req: Request, res: Response) {
  try {
    const userId = req.user!._id;
    const data = habitSchema.parse(req.body);
    const habit = await habitService.createHabit({ ...data, userId });
    res.status(201).json(habit);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : err });
  }
}

export async function getHabits(req: Request, res: Response) {
  try {
    const userId = req.user!._id;
    const habits = await habitService.getHabitsByUser(userId);
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch habits" });
  }
}

export async function updateHabit(req: Request, res: Response) {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    const updates = habitSchema.partial().parse(req.body);
    const habit = await habitService.updateHabit(id, userId, updates);
    if (!habit) return res.status(404).json({ error: "Habit not found" });
    res.json(habit);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : err });
  }
}

export async function archiveHabit(req: Request, res: Response) {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    const { archive } = req.body;
    const habit = await habitService.archiveHabit(
      id,
      userId,
      archive !== false,
    );
    if (!habit) return res.status(404).json({ error: "Habit not found" });
    res.json(habit);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : err });
  }
}

export async function deleteHabit(req: Request, res: Response) {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    const habit = await habitService.deleteHabit(id, userId);
    if (!habit) return res.status(404).json({ error: "Habit not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : err });
  }
}
