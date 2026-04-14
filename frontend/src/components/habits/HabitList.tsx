import React from "react";
import { Habit, HabitCard } from "./HabitCard";

export type HabitListProps = {
  habits: Habit[];
  loading?: boolean;
  error?: string;
  onEdit?: (habit: Habit) => void;
  onArchive?: (habit: Habit) => void;
  onRestore?: (habit: Habit) => void;
  onDelete?: (habit: Habit) => void;
};

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  loading,
  error,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
}) => {
  if (loading) {
    return <div className="flex flex-col gap-2">Loading habits...</div>;
  }
  if (error) {
    return <div className="text-red-600">{error}</div>;
  }
  if (!habits.length) {
    return (
      <div className="text-gray-500 text-center py-8">
        No habits yet. Start by adding one!
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onEdit={onEdit ? () => onEdit(habit) : undefined}
          onArchive={onArchive ? () => onArchive(habit) : undefined}
          onRestore={onRestore ? () => onRestore(habit) : undefined}
          onDelete={onDelete ? () => onDelete(habit) : undefined}
        />
      ))}
    </div>
  );
};
