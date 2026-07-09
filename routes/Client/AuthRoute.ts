import express from "express";
import { verifyAdmin } from "../../middlewere/AdminMiddlewere";
import { createClient, getClient, loginClient } from "../../controller/Client/AuthClientController";
import UploadLogo from "../../helper/Uploadlogo";
import { Clientverify } from "../../middlewere/ClientMiddlewere";
const route = express.Router();

route.post("/create",verifyAdmin,UploadLogo.single("logo"),createClient)
route.post("/login",loginClient)
route.get("/verifyclient",Clientverify,getClient as any)

 



export default route