import { useState } from "react";
import { useCreateHabit } from "../hooks/useHabits";
import { HabitInput } from "../types/habit";
import { useUIStore } from "../store/uiStore";

interface Props {
  onClose: () => void;
}

export default function AddHabitModal({ onClose }: Props) {
  const [form, setForm] = useState<HabitInput>({
    name: "",
    description: "",
    category: "Other",
  });
  const createHabit = useCreateHabit();
  const showSuccess = useUIStore((s) => s.showSuccess);
  const showError = useUIStore((s) => s.showError);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createHabit.mutate(form, {
      onSuccess: () => {
        showSuccess("Habit added");
        onClose();
      },
      onError: () => showError("Failed to add habit"),
    });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h2 className="text-lg font-bold mb-4">Add New Habit</h2>
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
            disabled={createHabit.isPending}
          >
            {createHabit.isPending ? "Adding..." : "Add Habit"}
          </button>
        </div>
      </form>
    </div>
  );
}
