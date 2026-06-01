import express from "express"
import { getAlluserChat, getChat, getMessage, sendMessage } from "../controller/Chat";
import { VerifyAuth } from "../middlewere/getAuth";

const routes = express.Router();

routes.get("/getuser",VerifyAuth,getAlluserChat as any)
routes.get("/getchat/:userid",VerifyAuth,getChat as any)
routes.get("/message/get/:chatId",VerifyAuth,getMessage as any)


routes.post("/message/send",VerifyAuth,sendMessage as any)





export default routes

