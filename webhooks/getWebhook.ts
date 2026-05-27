import express from "express";
import { GetMessages, ReceiveInstagramWebhook, SendInstagramMessage, VerifyWebhook } from "../controller/Webhook/WebhookController";
const router = express.Router();



router.get("/",VerifyWebhook)

router.post("/send",ReceiveInstagramWebhook)

router.get(
  "/instagram/messages",
  GetMessages
);

router.post(
  "/instagram/send",
  SendInstagramMessage
);


export default router





