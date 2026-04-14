import { useHabits } from "../hooks/useHabits";
import { useHabitStore } from "../store/habitStore";
import HabitActions from "./HabitActions";
import EditHabitModal from "./EditHabitModal";
import { useState } from "react";

export default function HabitList() {
  const { data: habits, isLoading, error } = useHabits();
  const { selectedHabit, setSelectedHabit } = useHabitStore();
  const [showEdit, setShowEdit] = useState(false);

  if (isLoading) return <div>Loading habits...</div>;
  if (error) return <div>Error loading habits</div>;
  if (!habits || habits.length === 0) return <div>No habits found.</div>;

  return (
    <>
      <ul className="divide-y divide-gray-200">
        {habits.map((habit) => (
          <li
            key={habit._id}
            className="py-3 px-2 hover:bg-gray-50 flex justify-between items-center"
          >
            <div
              onClick={() => {
                setSelectedHabit(habit);
                setShowEdit(true);
              }}
              className="flex-1 cursor-pointer"
            >
              <div className="font-medium">{habit.name}</div>
              <div className="text-xs text-gray-500">{habit.category}</div>
              {habit.isArchived && (
                <span className="text-xs text-yellow-500 ml-2">Archived</span>
              )}
            </div>
            <HabitActions
              habit={habit}
              onEdit={() => {
                setSelectedHabit(habit);
                setShowEdit(true);
              }}
            />
          </li>
        ))}
      </ul>
      {showEdit && selectedHabit && (
        <EditHabitModal
          habit={selectedHabit}
          onClose={() => {
            setShowEdit(false);
            setSelectedHabit(null);
          }}
        />
      )}
    </>
  );
}
