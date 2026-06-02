import express from "express";
import { createMeeting, GetMeeting, joinMeeting } from "../controller/MeetController";
import { VerifyAuth } from "../middlewere/getAuth";
const routes = express.Router();


routes.post("/create", VerifyAuth  ,createMeeting as any)
routes.post("/join",joinMeeting)
routes.get("/getall", VerifyAuth  ,GetMeeting as any)





export default routes

