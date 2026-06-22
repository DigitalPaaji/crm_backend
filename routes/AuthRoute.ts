import express from "express";
import { accessChange, changePassword, CreateAdmin, createEmp, EditProfile, emplRemove, emplStatus, getAllEMp, getUser, LoginAdmin, LoginAgency, LoginEmp } from "../controller/AuthController";
import { VerifyAuth } from "../middlewere/getAuth";
import { verifyAdmin } from "../middlewere/AdminMiddlewere";
import { verifyAccess } from "../middlewere/verifyAccess";

const route = express.Router();


route.get("/user/verify",VerifyAuth,getUser as any)
route.post("/admin/create",CreateAdmin)
route.post("/admin/login",LoginAdmin)
route.post("/emp/login",LoginEmp)
route.post("/agency/login",LoginAgency)

 
route.post("/emp/create",verifyAccess,createEmp)
route.get("/emp/getall",verifyAccess,getAllEMp)
route.get("/emp/statusupdate/:id",verifyAdmin,emplStatus)
route.delete("/emp/delete/:id",verifyAdmin,emplRemove)


route.put("/user/updateprofile",VerifyAuth,EditProfile as any)
route.put("/user/updatepassword",VerifyAuth,changePassword as any)
  
 route.put("/emp/access", verifyAccess, accessChange as any)

export default route
