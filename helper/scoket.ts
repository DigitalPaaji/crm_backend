
import { Server } from "socket.io";

export const initializeSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("join-chat", (chatId: string) => {
      socket.join(chatId);
      
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });
};