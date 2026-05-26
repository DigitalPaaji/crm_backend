import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITodo extends Document {
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  user: Types.ObjectId;

  color:string;
  
}

const todoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: {
      type: Date,
    },
color:{
    type:String,
    default:"#ffffff"
},
    user: {
      type: Schema.Types.ObjectId,
      ref: "employee",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Todo = mongoose.model<ITodo>("todo", todoSchema);