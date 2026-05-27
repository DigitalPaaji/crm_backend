
import express from "express";
import { genrateImage, genrateQNS } from "../controller/AiController";
const route = express.Router();

route.post("/image",genrateImage)
route.post("/chat",genrateQNS)


export default route


