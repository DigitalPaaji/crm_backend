import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

import errorHandler from "./middlewere/ErrorHandel";
import AuthRoute from "./routes/AuthRoute"
import AiRoute from "./routes/AiRoutes"
import LeadsRoute from "./routes/LeadsRoute"
import InstaRoute from "./routes/instaRoute"
import todoRoute from "./routes/todoRoutes"
import chatRoute from "./routes/chatRoute"
import meetRoute from "./routes/meetingRoutes"
import ShearRoute from "./routes/ShearRoutes"



import path from "path"
import cors from "cors"
import { watchVideo } from "./controller/ShearController";
// import { initializeSocket } from "./helper/scoket";

dotenv.config()
const app = express();
const server = http.createServer(app);
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.urlencoded({ extended: true }));


app.get("/ping",(req,res)=>{
    return res.send("pong crm")
})

app.get("/uploads/video/:filename",watchVideo)
app.use("/api/v1/auth",AuthRoute)

app.use("/api/v1/ai",AiRoute)

app.use("/api/v1/leads",LeadsRoute)
app.use("/api/v1/insta",InstaRoute)
app.use("/api/v1/todo",todoRoute)

app.use("/api/v1/chat",chatRoute)
app.use("/api/v1/meet",meetRoute)
app.use("/api/v1/shear",ShearRoute)


app.use(errorHandler);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});



// app.set("io", io);


const PORT :number = Number(process.env.PORT) 
mongoose.connect(process.env.DB_URL!).then(()=>{

    server.listen(PORT,()=>{
        console.log(`http://localhost:${PORT}`)
    });
})


const rooms = {} as any;

io.on("connection",(socket)=>{

  


   socket.on("join-room", ({ roomId, name }) => {
   socket.join(roomId);
rooms[socket.id] = { roomId, name, isVideoOff: false, isAudioMuted: false };
const clientsInRoom = io.sockets.adapter.rooms.get(roomId);
const existingUsers = [] as any;
if (clientsInRoom) {
      clientsInRoom.forEach((clientId) => {
        if (clientId !== socket.id) {
          existingUsers.push({
            id: clientId,
            name: rooms[clientId].name,
          });
        }
      });
    }
   

socket.emit("existing-users", existingUsers);

socket.to(roomId).emit("user-joined", {
      callerId: socket.id,
      name: name,
    });
  });
  

   socket.on("offer", (payload) => {
  io.to(payload.target).emit("offer", payload);
  });

   socket.on("answer", (payload) => {
   io.to(payload.target).emit("answer", payload);
  });

   socket.on("ice-candidate", (payload) => {
    io.to(payload.target).emit("ice-candidate", payload);
  });


  socket.on("media-state-change", (payload) => {
    if (rooms[socket.id]) {
      rooms[socket.id].isVideoOff = payload.isVideoOff;
      rooms[socket.id].isAudioMuted = payload.isAudioMuted;
      socket.to(payload.roomId).emit("peer-media-state-change", {
        id: socket.id,
        isVideoOff: payload.isVideoOff,
        isAudioMuted: payload.isAudioMuted,
      });
    }
  });









  socket.on("join-chat", (chatId) => {
    socket.join(chatId);
     
  });
  socket.on("typing", (chatId) => {
    socket.to(chatId).emit("true-typing");
  });


  socket.on("send-message",({chatId,message})=>{
      socket.to(chatId).emit("receive-message", message);
  })
   socket.on("stop-typing", (chatId) => {
    socket.to(chatId).emit("false-typing");
  });
  
   






socket.on("leave-chat", (chatId) => {
  socket.leave(chatId);
});
 socket.on("disconnect", () => {
const user = rooms[socket.id];
    if (user) {
      // Notify others in the room
      socket.to(user.roomId).emit("user-disconnected", socket.id);
      delete rooms[socket.id];
    }

  });
})





