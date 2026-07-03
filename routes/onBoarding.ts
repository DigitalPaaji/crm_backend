import express from "express";
import { createClientOnboarding, GetClientBoard, GetClientBoardSingle } from "../controller/ClientOnboarding";
import { verifyAdmin } from "../middlewere/AdminMiddlewere";

const route = express.Router();

route.post("/create",createClientOnboarding)
route.get("/get",verifyAdmin as any,GetClientBoard)
route.get("/get/:id",verifyAdmin as any,GetClientBoardSingle)

export default route