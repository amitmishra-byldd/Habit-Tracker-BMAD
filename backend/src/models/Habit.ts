import { Schema, model, Types, Document } from "mongoose";

export interface IHabit extends Document {
  userId: Types.ObjectId;
  name: string;
  description?: string;
  category: "DSA" | "Projects" | "Learning" | "Other";
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const habitSchema = new Schema<IHabit>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      enum: ["DSA", "Projects", "Learning", "Other"],
      default: "Other",
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

habitSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Habit = model<IHabit>("Habit", habitSchema);
