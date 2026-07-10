import express from "express";
import { Clientverify } from "../../middlewere/ClientMiddlewere";
import { createOrUpdateClientReqLead, getClientLeadVisibleFields, getReq } from "../../controller/Client/LeadControlllerClient";

const route = express.Router();

route.post("/create/requ",Clientverify,createOrUpdateClientReqLead as any)
route.get("/get/requ",Clientverify,getReq as any)
route.get("/get/allow",Clientverify,getClientLeadVisibleFields as any)


export default route