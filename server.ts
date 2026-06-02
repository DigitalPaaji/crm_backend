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



import path from "path"
import cors from "cors"
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

app.use("/api/v1/auth",AuthRoute)

app.use("/api/v1/ai",AiRoute)

app.use("/api/v1/leads",LeadsRoute)
app.use("/api/v1/insta",InstaRoute)
app.use("/api/v1/todo",todoRoute)

app.use("/api/v1/chat",chatRoute)
app.use("/api/v1/meet",meetRoute)



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


//  const initializeSocket = (io: Server) => {
//   io.on("connection", (socket) => {
//     console.log("User Connected:", socket.id);

//     socket.on("join-chat", (chatId: string) => {
//       socket.join(chatId);
      
//     });

//     socket.on("disconnect", () => {
//       console.log("Disconnected:", socket.id);
//     });
//   });
// };



// initializeSocket(io);



io.on("connection",(socket)=>{

    socket.on("join-chat", (chatId) => {
    socket.join(chatId);
     
  });


   socket.on("join-room", (roomid,name) => {
    socket.join(roomid);
     const room =
    io.sockets.adapter.rooms.get(roomid);


      const roomsize= room ? room.size : 0
  console.log("roomjoin" , roomsize)
    // Tell everyone else in the room that a new user joined
    socket.to(roomid).emit("user-joined", socket.id,name,roomsize);
  });
  

   socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
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

  });
})





