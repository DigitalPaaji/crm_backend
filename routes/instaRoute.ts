import express from "express";
import { Create_Story_Post_Image, Create_Story_Post_Video, Create_Video_Post, CreateInstaAcc, CreatePost, GetAllAccount, GetInstaPage, GetSinglePost, ReplytoComment, SearchLocation } from "../controller/Insta/createAccountController.ts";
import { EmpAccountverify } from "../middlewere/empAccMiddlewere.ts";
import { upload } from "../helper/multerUploads.ts";
import { uploadVideo } from "../helper/multerUploadVideo.ts";

const route = express.Router();


route.post("/create-account",EmpAccountverify,CreateInstaAcc as any)
route.get("/getall-account",EmpAccountverify,GetAllAccount as any)
route.get("/get-account/:id",EmpAccountverify,GetInstaPage as any)
route.get("/get/search/:accountId",EmpAccountverify,SearchLocation as any)
route.get("/get/post",EmpAccountverify,GetSinglePost as any)

route.post("/create_post",EmpAccountverify,upload.single("image"),CreatePost as any)
route.post("/create_Video_post",EmpAccountverify,uploadVideo.single("video"),Create_Video_Post as any)




route.post("/create_story/image",EmpAccountverify,upload.single("image"),Create_Story_Post_Image as any)
route.post("/create_story/video",EmpAccountverify,uploadVideo.single("video"),Create_Story_Post_Video as any)




route.post("/create_carousel/",EmpAccountverify,upload.array("media", 10),Create_Story_Post_Video as any)
route.post("/reply/comment",EmpAccountverify,ReplytoComment as any)








export default route