import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import errorHandler from "./middlewere/ErrorHandel";
import AuthRoute from "./routes/AuthRoute"
import AiRoute from "./routes/AiRoutes"
import LeadsRoute from "./routes/LeadsRoute"
import InstaRoute from "./routes/instaRoute"
import todoRoute from "./routes/todoRoutes"
import path from "path"
import cors from "cors"

dotenv.config()

const app = express();
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




app.use(errorHandler);

const PORT :number = Number(process.env.PORT) 
mongoose.connect(process.env.DB_URL!).then(()=>{

    app.listen(PORT,()=>{
        console.log(`http://localhost:${PORT}`)
    });
})


