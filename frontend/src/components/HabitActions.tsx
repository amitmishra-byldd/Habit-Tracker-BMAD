import { useArchiveHabit, useDeleteHabit } from "../hooks/useHabits";
import { Habit } from "../types/habit";

interface Props {
  habit: Habit;
  onEdit: () => void;
}

export default function HabitActions({ habit, onEdit }: Props) {
  const archiveHabit = useArchiveHabit();
  const deleteHabit = useDeleteHabit();

  return (
    <div className="flex gap-2">
      <button
        className="text-blue-600 hover:underline text-xs"
        onClick={onEdit}
      >
        Edit
      </button>
      <button
        className="text-yellow-600 hover:underline text-xs"
        disabled={archiveHabit.isPending}
        onClick={() =>
          archiveHabit.mutate({ id: habit._id, archive: !habit.isArchived })
        }
      >
        {habit.isArchived ? "Restore" : "Archive"}
      </button>
      <button
        className="text-red-600 hover:underline text-xs"
        disabled={deleteHabit.isPending}
        onClick={() => deleteHabit.mutate(habit._id)}
      >
        Delete
      </button>
    </div>
  );
}
