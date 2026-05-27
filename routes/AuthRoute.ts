import express from "express";
import { CreateAdmin, createEmp, emplRemove, emplStatus, getAllEMp, getUser, LoginAdmin, LoginAgency, LoginEmp } from "../controller/AuthController";
import { VerifyAuth } from "../middlewere/getAuth";
import { verifyAdmin } from "../middlewere/AdminMiddlewere";

const route = express.Router();


route.get("/user/verify",VerifyAuth,getUser as any)
route.post("/admin/create",CreateAdmin)
route.post("/admin/login",LoginAdmin)
route.post("/emp/login",LoginEmp)
route.post("/agency/login",LoginAgency)


route.post("/emp/create",verifyAdmin,createEmp)
route.get("/emp/getall",verifyAdmin,getAllEMp)
route.get("/emp/statusupdate/:id",verifyAdmin,emplStatus)
route.get("/emp/delete/:id",verifyAdmin,emplRemove)

  


export default route
