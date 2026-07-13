import express from "express";
import { Clientverify } from "../../middlewere/ClientMiddlewere";
import { createLead, createOrUpdateClientReqLead, deletLead, getClientLeadVisibleFields, getLeads, getLeadsFollowup, getMyLead, getReq, leadFollowUpCreate } from "../../controller/Client/LeadControlllerClient";

const route = express.Router();

route.post("/create/requ",Clientverify,createOrUpdateClientReqLead as any)
route.get("/get/requ",Clientverify,getReq as any)
route.get("/get/allow",Clientverify,getClientLeadVisibleFields as any)

route.post("/lead/create",Clientverify,createLead as any)

route.get("/lead/get",Clientverify,getLeads as any)
route.get("/lead/get/:leadid",Clientverify,getMyLead as any)

route.get("/followup/get/:leadid",Clientverify,getLeadsFollowup as any)

route.post("/followup/create/:leadid",Clientverify,leadFollowUpCreate as any)

route.delete("/delete/:leadid",Clientverify,deletLead as any)



export default route