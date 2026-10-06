import express from "express";
import { convertToLead, createClientOnboarding, GetClientBoard, GetClientBoardSingle } from "../controller/ClientOnboarding";
import { verifyAdmin } from "../middlewere/AdminMiddlewere";
import { verifyAgency } from "../middlewere/AgencyMiddlewere";

const route = express.Router();

route.post("/create",createClientOnboarding)
route.get("/get",verifyAdmin as any,GetClientBoard)
route.get("/get/:id",verifyAdmin as any,GetClientBoardSingle)
route.get("/agency/get",verifyAgency as any,GetClientBoard)
route.get("/agency/get/:id",verifyAgency as any,GetClientBoardSingle)
route.put("/agency/convert/:id",verifyAgency as any,convertToLead as any)



export default route