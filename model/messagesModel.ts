import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    recipientId: {
      type: String,
    },
    messageId: {
      type: String,
      unique: true,
    },
    text: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("InstagramMessage", messageSchema);