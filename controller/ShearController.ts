import { NextFunction, Request, Response } from "express";
import Shear from "../model/shearFileModel";
import fs from "fs";
import path from "path";
import { userInfo } from "os";
import { DeleteFile } from "../helper/deleteImage";
interface IAuth extends Request{
    user: any
}

export const sendFile = async ( req: IAuth,res: Response,next: NextFunction) => {
  try {
    const user = req.user;
    const { sendto, title = "", des = "" } = req.body;

    if (!sendto) {
      return res.status(400).json({
        success: false,
        message: "Receiver is required",
      });
    }

    const uploadedFiles = (req.files as Express.Multer.File[]) || [];

    const files = uploadedFiles.map((item) => ({
      file: `uploads/${item.mimetype.split("/")[0]}/${item.filename}`,
      filetype: item.mimetype.split("/")[0],
    }));

    const shear = await Shear.create({
      files,
      sendby: user._id,
      sendto,
      title,
      des,
    });

    return res.status(201).json({
      success: true,
      message: "Files sent successfully",
      data: shear,
    });
  } catch (error) {
    next(error);
  }
};

export const getALL= async( req: IAuth,res: Response,next: NextFunction)=>{
try {
   const { scrollcount, date, my, forme } = req.query; 
    const user = req.user;

const filterQuery: any = {};
filterQuery.status = true
if (my === 'true') {
      filterQuery.sendby = user._id; 
    }
    
    if (forme === 'true') {
      filterQuery.sendto = user._id;
    }

if (date) {
      const targetDate = new Date(date as string);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

      filterQuery.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }



    const limit = 20;
    const page = parseInt(scrollcount as string) || 0; 
    const skip = page * limit;


 const files = await Shear.find(filterQuery).sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit).populate("sendby", "name email profile")
      .populate("sendto", "name email profile");


      res.status(200).json({
      success: true,
      data: files,
      hasMore: files.length === limit 
    });

} catch (error) {
    next(error)
}
}


export const watchVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filename } = req.params;

    const videoPath = path.join(
      process.cwd(),
      "uploads",
      "video",
      filename as string
    );

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize - 1;

      const chunkSize = end - start + 1;

      const file = fs.createReadStream(videoPath, {
        start,
        end,
      });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      });

      file.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      });

      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    next(error);
  }
};

export const deleteShear = async (
  req: IAuth,
  res: Response,
  next: NextFunction
) => {
  try {
    const shearid = req.params.id;
    const user = req.user;

    const shear = await Shear.findById(shearid);

    if (!shear) {
      return res.status(404).json({
        success: false,
        message: "Shear not found",
      });
    }

    // Optional: only creator can delete
    if ( shear.sendby.toString() !== user._id.toString() && user.role  !== "admin"   ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    
   
    shear.status = false
    
    await shear.save();

    return res.status(200).json({
      success: true,
      message: "Shear deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const deletePermanent=async(  req: IAuth,
  res: Response,
  next: NextFunction)=>{
  try {

    const shearid = req.params.id;
    const user = req.user;

    const shear = await Shear.findById(shearid);

    if (!shear) {
      return res.status(404).json({
        success: false,
        message: "Shear not found",
      });
    }

    // Optional: only creator can delete
    if (user.role  !== "admin"   ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
     await Promise.all(
      shear.files.map((item) => DeleteFile(item.file))
    );
await shear.deleteOne();


return res.status(200).json({
      success: true,
      message: "Shear deleted successfully",
    });

  } catch (error) {
        next(error);
  }
}


  

export const getALLArchive= async( req: IAuth,res: Response,next: NextFunction)=>{
try {
   const { scrollcount, date } = req.query; 
    const user = req.user;

const filterQuery: any = {};
filterQuery.status = false


if (date) {
      const targetDate = new Date(date as string);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

      filterQuery.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }



    const limit = 20;
    const page = parseInt(scrollcount as string) || 0; 
    const skip = page * limit;


 const files = await Shear.find(filterQuery).sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit).populate("sendby", "name email profile")
      .populate("sendto", "name email profile");





      res.status(200).json({
      success: true,
      data: files,
      hasMore: files.length === limit 
    });

} catch (error) {
    next(error)
}
}