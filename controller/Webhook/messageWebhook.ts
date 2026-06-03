import type { NextFunction, Request, Response } from "express";

import InstaUser from "../../model/instaModel";

export const challenge = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
 
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
  } catch (error) {
    next(error);
  }
};



export const PostWebhook= async( req: Request,res: Response, next: NextFunction)=>{
try {
      const body = req.body;

    console.log(JSON.stringify(body, null, 2));
  if (body.object === "instagram") {
      body.entry?.forEach((entry : any) => {
        entry.messaging?.forEach((event :any) => {
          if (event.message) {
            console.log("Sender:", event.sender.id);
            console.log("Message:", event.message.text);
          }
        });
      });
    }

    res.sendStatus(200);
  
} catch (error) {
  next(error)
}
}