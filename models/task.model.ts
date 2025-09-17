import { Schema, model } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  completed: boolean;
}

const taskSchema = new Schema<ITask>({
    title: { type: String, required: true, index: true, trim: true },
    description: { type: String, trim: true },
    completed: { type: Boolean, default: false }
}, { timestamps: true });

export const Task = model<ITask>("Task", taskSchema)