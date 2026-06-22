import express from "express";
import FileUpload from "../helper/FilesUpload";
import { deletePermanent, deleteShear, getALL, getALLArchive, sendFile } from "../controller/ShearController";
import { VerifyAuth } from "../middlewere/getAuth";
import { verifyAdmin } from "../middlewere/AdminMiddlewere";

const routes = express.Router()

routes.post( "/upload",VerifyAuth,FileUpload.array("files", 20),sendFile as any)

routes.get("/get",VerifyAuth,getALL as any)

routes.delete("/delete/:id",VerifyAuth,deleteShear as any)

routes.delete("/permanent/delete/:id",verifyAdmin,deletePermanent  as any)

routes.get("/get/archive",verifyAdmin,getALLArchive as any)

export default routes

