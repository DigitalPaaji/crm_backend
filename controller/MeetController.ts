import type  { NextFunction, Request, Response } from "express";
import Meeting from "../model/meetingSchema";



interface AuthReq extends Request{
    user :any
}



 export const createMeeting = async(req:AuthReq,res:Response,next:NextFunction)=>{
try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }


    const roomid = crypto.randomUUID();

    const room = await Meeting.create({
      roomid,
      password,
      createby: req.user._id,
    });
    
    return res.status(201).json({
      success: true,
      room,
      meetingLink: `${process.env.FRONTEND_URL?.split(",")[0]}/meet/${roomid}`,
    });



} catch (error) {
    next(error)
}
}

export const joinMeeting = async (req: Request,  res: Response,next: NextFunction) => {
  try {
    const { roomid, password } = req.body;

    const room = await Meeting.findOne({ roomid });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    if (room.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    return res.status(200).json({
      success: true,
      message:"meet join",
      roomid,
    });
  } catch (error) {
    next(error);
  }
};


export const GetMeeting = async (req: AuthReq,  res: Response,next: NextFunction)=>{
  try {
    const  createby = req.user._id

   const meets = await  Meeting.find({createby})
   
   
   return res.status(200).json({
   
success:true,
meets

   })

  } catch (error) {
    next(error)
  }
}



export const deleteChatRoomid = async (
  req: AuthReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const chatRoom = await Meeting.findOne({
      _id: id,
      createby: user._id,
    });

    if (!chatRoom) {
      return res.status(404).json({
        success: false,
        message: "Chat room not found",
      });
    }

    await chatRoom.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Chat room deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};





