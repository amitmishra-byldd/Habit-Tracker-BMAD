import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export type AddHabitModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (data: {
    name: string;
    description?: string;
    category?: string;
  }) => void;
  loading?: boolean;
  error?: string;
};

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  open,
  onClose,
  onAdd,
  loading,
  error,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [touched, setTouched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      description: description.trim() || undefined,
      category: category.trim() || undefined,
    });
  };

  const reset = () => {
    setName("");
    setDescription("");
    setCategory("");
    setTouched(false);
  };

  React.useEffect(() => {
    if (!open) reset();
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title="Add Habit">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          error={touched && !name.trim() ? "Name is required" : undefined}
          autoFocus
        />
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="habit-description"
          >
            Description
          </label>
          <textarea
            id="habit-description"
            className="w-full rounded border-gray-300 focus:ring-blue-600 focus:border-blue-600 min-h-[60px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            className="w-full rounded border-gray-300 focus:ring-blue-600 focus:border-blue-600"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            <option value="Health">Health</option>
            <option value="Productivity">Productivity</option>
            <option value="Learning">Learning</option>
            <option value="Wellness">Wellness</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Add
          </Button>
        </div>
      </form>
    </Modal>
  );
};
