import mongoose, { Schema, Document } from "mongoose";

interface IChat extends Document {
  users: mongoose.Types.ObjectId[];
}

const ChatSchema = new Schema<IChat>(
  {
    // Only 2 users connect
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employee",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Validation for exactly 2 users
// ChatSchema.path("users").validate(function (users: any[]) {
//   return users.length === 2;
// }, "Chat must contain exactly 2 users");

const Chat =  mongoose.model<IChat>("chat", ChatSchema);

export default Chat