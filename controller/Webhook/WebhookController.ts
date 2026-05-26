import  type{ Request, Response } from "express";
import InstagramMessage from "../../model/messagesModel.ts"
import InstaUser from "../../model/instaModel.ts"


export const VerifyWebhook = (
  req: Request,
  res: Response
) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === VERIFY_TOKEN
  ) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
};

export const ReceiveInstagramWebhook = async (
  req: Request,
  res: Response
) => {
  try {
    const body = req.body;

    if (body.object === "instagram") {
      for (const entry of body.entry || []) {
        for (const messaging of entry.messaging || []) {

          if (messaging.message) {
            await InstagramMessage.create({
              senderId: messaging.sender?.id,
              recipientId: messaging.recipient?.id,
              messageId: messaging.message?.mid,
              text: messaging.message?.text || "",
            });
          }
        }
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const GetMessages = async (
  req: Request,
  res: Response
) => {
  try {
    const messages = await InstagramMessage.find()
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
};

export const SendInstagramMessage = async (req: Request, res: Response) => {
  try {
    const { recipientId, text ,accountId} = req.body;


    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: "accountId is required",
      });
    }


    const instaAcc =
          await InstaUser.findById(accountId).select("+pageAccessToken");
    
        if (!instaAcc) {
          return res.status(404).json({
            success: false,
            message: "Instagram account not found",
          });
        }





    const response = await fetch(
      `https://graph.facebook.com/v23.0/me/messages`,
  
      {

        method:"POST",
        headers: {
          Authorization: `Bearer ${instaAcc.pageAccessToken}`,
        },
        body: JSON.stringify({recipient: {id: recipientId},  message: {text}})

      }
    );

    return res.json(response.json());
  } catch (error: any) {
    return res.status(500).json(error?.response?.data);
  }
};