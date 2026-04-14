import React from "react";
import { cn } from "../../lib/utils";

export type Habit = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  archived?: boolean;
};

type HabitCardProps = {
  habit: Habit;
  onEdit?: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
  onDelete?: () => void;
  className?: string;
};

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow p-4 flex flex-col gap-2 border border-gray-100 relative",
        habit.archived ? "opacity-60" : "",
        className,
      )}
      tabIndex={0}
      aria-label={`Habit: ${habit.name}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-semibold text-gray-800 flex-1 truncate">
          {habit.name}
        </div>
        {habit.archived && (
          <span className="ml-2 px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-600">
            Archived
          </span>
        )}
      </div>
      {habit.category && (
        <div className="text-xs text-blue-600 font-mono">{habit.category}</div>
      )}
      {habit.description && (
        <div className="text-sm text-gray-700 whitespace-pre-line">
          {habit.description}
        </div>
      )}
      <div className="flex gap-2 mt-2">
        {onEdit && (
          <button
            className="text-blue-600 hover:underline text-xs"
            onClick={onEdit}
            aria-label="Edit habit"
          >
            Edit
          </button>
        )}
        {habit.archived
          ? onRestore && (
              <button
                className="text-green-600 hover:underline text-xs"
                onClick={onRestore}
                aria-label="Restore habit"
              >
                Restore
              </button>
            )
          : onArchive && (
              <button
                className="text-yellow-600 hover:underline text-xs"
                onClick={onArchive}
                aria-label="Archive habit"
              >
                Archive
              </button>
            )}
        {onDelete && (
          <button
            className="text-red-600 hover:underline text-xs ml-auto"
            onClick={onDelete}
            aria-label="Delete habit"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
