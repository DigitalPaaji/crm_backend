import { NextFunction, Request, Response } from "express";
import Emp from "../model/employModel";
import Chat from "../model/groupModel";
import { getRefs } from "openai/_vendor/zod-to-json-schema/Refs.mjs";
import Message from "../model/messagesModel";


interface Authuser extends Request{
    user : any
}
export const getAlluserChat= async(req:Authuser,res:Response,next:NextFunction)=>{
try {
    const user = req.user;
   
   const allEmp = await Emp.find({
      _id: { $ne: user._id },
    }).select("name role profile");

    return res.status(200).json({
      success: true,
      users: allEmp,
    });
     


} catch (error) {
        next(error)
}
}


export const getChat= async(req:Authuser,res:Response,next:NextFunction)=>{
    try {
       const user = req.user;
       const {userid} = req.params;

 let chat = await Chat.findOne({
      users: {
        $all: [user._id, userid],
      },
    })
if (!chat) {
      chat = await Chat.create({
        users: [user._id, userid],
      });

   
    }
  return res.status(200).json({
      success: true,
      chat: chat,
    });
    } catch (error) {
         next(error);
    }
}

export const sendMessage = async(req:Authuser,res:Response,next:NextFunction)=>{
  try {
    const {chatId,text} = req.body
    const senderId= req.user._id;
     
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    const isMember = chat.users.some(
      (userId: any) => userId.toString() === senderId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this chat",
      });
    }




const message = await Message.create({
  chatId,text,senderId
})







 return res.status(201).json({
      success: true,
      message,
    });



  } catch (error) {
next(error)    
  }
}

export const getMessage = async(req:Authuser,res:Response,next:NextFunction)=>{
  try {
    const {chatId} = req.params
    const user = req.user;
    
   const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }


 const isMember = chat.users.some(
      (userId: any) => userId.toString() === user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this chat",
      });
    }
    const allMessage = await Message.find({chatId})
    return res.status(200).json({success:true,message:allMessage})
  } catch (error) {
    next(error)
  }
}



