import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as habitsApi from "../api/habits";
import { Habit, HabitInput } from "../types/habit";

export function useHabits() {
  return useQuery<Habit[]>({
    queryKey: ["habits"],
    queryFn: habitsApi.fetchHabits,
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: habitsApi.createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useUpdateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<HabitInput> }) =>
      habitsApi.updateHabit(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useArchiveHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, archive }: { id: string; archive?: boolean }) =>
      habitsApi.archiveHabit(id, archive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: habitsApi.deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}
