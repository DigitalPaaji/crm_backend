import express from "express";
import { createLead, deleteFollowup, DeleteLead, Followdup, getallLeads, getallLeadsAdmin, getLastFolowUps, getMyLeads, getSingleLead, tempDelete, updateLeads, UploadXlFile } from "../controller/AgencyController/LeadsController";
import { verifyAgency } from "../middlewere/AgencyMiddlewere";
import { verifyAdmin } from "../middlewere/AdminMiddlewere";
import uploadxl from "../helper/MulterUploadxl";

const route = express.Router();

route.post("/create",verifyAgency,createLead as any)
route.post("/create/xl",verifyAgency,uploadxl.single("file"),UploadXlFile as any)
route.get("/get-all-leads",verifyAgency,getallLeads as any)
route.get("/get-my-leads",verifyAgency,getMyLeads as any)
route.get("/get-leads-by-date",verifyAgency,getLastFolowUps as any)
route.get("/get-lead/:leadid",verifyAgency,getSingleLead as any)
route.put("/update-lead/:id",verifyAgency,updateLeads as any)
route.put("/update-followup/:id",verifyAgency,Followdup as any)
route.put("/delete-followup/:id",verifyAgency,deleteFollowup as any)
route.delete("/temp-delete/:id",verifyAgency,tempDelete as any)

// admin
route.get("/admin/get-all-leads",verifyAdmin,getallLeadsAdmin as any)
route.get("/admin/get-lead/:leadid",verifyAdmin,getSingleLead as any)
route.put("/admin/update-lead/:id",verifyAdmin,updateLeads as any)
route.delete("/admin/delete/:id",verifyAdmin,DeleteLead as any)



//webhook





export default route 