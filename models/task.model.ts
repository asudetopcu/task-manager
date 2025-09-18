import { Schema, Types, model } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  completed: boolean;
  userId: Types.ObjectId;
}

const taskSchema = new Schema<ITask>({
    title: { type: String, required: true, index: true, trim: true },
    description: { type: String, trim: true },
    completed: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true}
}, { timestamps: true });

export const Task = model<ITask>("Task", taskSchema)