
import type { NextFunction, Request, Response } from "express";
import { sendWelcomeEmail } from "../../helper/sendMail";
import bcrypt from "bcryptjs"
import Client from "../../model/ClientSchema";



export const createClient= async(req:Request,res:Response,next:NextFunction)=>{
try {
    const {ownername,agencyname,email,password,validity} = req.body
    const file = req.file as Express.Multer.File;
    
     if (!ownername || !agencyname || !email || !password || !validity) {
       return res.status(400).json({
         success: false,
         message: "All fields are required",
        });
      }
      
      const existClient = await Client.findOne({ email });
      
      if (existClient) {
        return res.status(409).json({
          success: false,
          message: "Client already exists with this email",
        });
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      
      
      let logo = "";

      if (file) {
        
        logo = `/uploads/client/${file.filename}`;
        
        // For cloud/R2 upload use this type:
        // const uploadResult = await UploadR2Image(file, "client");
        // logo = uploadResult.url;
      }

      
      const client = await Client.create({
        ownername,
        agencyname,
        email,
        password: hashPassword,
        validity: new Date(validity),
        logo,
        
        
      });
      
    
      await sendWelcomeEmail(email,password)
     

 return res.status(201).json({
      success: true,
      message: "Client created successfully",
      
    });



} catch (error) {
   next(error) 
}
}
