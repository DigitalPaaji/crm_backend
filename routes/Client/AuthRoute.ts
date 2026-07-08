import express from "express";
import { verifyAdmin } from "../../middlewere/AdminMiddlewere";
import { createClient } from "../../controller/Client/AuthClientController";
import UploadLogo from "../../helper/Uploadlogo";
const route = express.Router();

route.post("/create",verifyAdmin,UploadLogo.single("logo"),createClient)






export default route