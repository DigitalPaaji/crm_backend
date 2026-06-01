import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
ref:"employee"
    },
   
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
     ref:"chat"
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
   const Message =   mongoose.model("Message", messageSchema);

   export default  Message;


