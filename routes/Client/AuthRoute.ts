import express from "express";
import { verifyAdmin } from "../../middlewere/AdminMiddlewere";
import { createClient, CreatSubUser, deleteSubClient, getClient, getClientDetals, getClients, getSubUser, loginClient, updateClientById } from "../../controller/Client/AuthClientController";
import UploadLogo from "../../helper/Uploadlogo";
import { Clientverify } from "../../middlewere/ClientMiddlewere";
const route = express.Router();

route.post("/create",verifyAdmin,UploadLogo.single("logo"),createClient)
route.post("/login",loginClient)
route.get("/verifyclient",Clientverify,getClient as any)
route.get("/getall",verifyAdmin,getClients)
 route.patch("/update/:clientid",verifyAdmin,updateClientById)

route.post("/subuser/create",Clientverify,CreatSubUser as any)
route.get("/subuser/get",Clientverify,getSubUser as any)

route.get("/aboutclient",Clientverify,getClientDetals as any)

route.delete("/subuser/delete/:subclientid",Clientverify,deleteSubClient as any)

// 


export default route