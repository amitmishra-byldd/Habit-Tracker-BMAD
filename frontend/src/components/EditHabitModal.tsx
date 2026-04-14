import { useUpdateHabit } from "../hooks/useHabits";
import { Habit, HabitInput } from "../types/habit";
import { useUIStore } from "../store/uiStore";
import { useState, useEffect } from "react";

interface Props {
  habit: Habit;
  onClose: () => void;
}

export default function EditHabitModal({ habit, onClose }: Props) {
  const [form, setForm] = useState<HabitInput>({
    name: habit.name,
    description: habit.description || "",
    category: habit.category,
  });
  const updateHabit = useUpdateHabit();
  const showSuccess = useUIStore((s) => s.showSuccess);
  const showError = useUIStore((s) => s.showError);

  useEffect(() => {
    setForm({
      name: habit.name,
      description: habit.description || "",
      category: habit.category,
    });
  }, [habit]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateHabit.mutate(
      { id: habit._id, input: form },
      {
        onSuccess: () => {
          showSuccess("Habit updated");
          onClose();
        },
        onError: () => showError("Failed to update habit"),
      },
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h2 className="text-lg font-bold mb-4">Edit Habit</h2>
        <div className="mb-3">
          <label className="block mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            maxLength={100}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            maxLength={500}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="DSA">DSA</option>
            <option value="Projects">Projects</option>
            <option value="Learning">Learning</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 rounded bg-blue-600 text-white"
            disabled={updateHabit.isPending}
          >
            {updateHabit.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
