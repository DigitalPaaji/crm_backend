
import type { NextFunction, Request, Response } from "express";
import { sendWelcomeEmail } from "../../helper/sendMail";
import bcrypt from "bcryptjs"
import Client from "../../model/ClientSchema";
import JWT from "jsonwebtoken"


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
        
        logo = `/uploads/logo/${file.filename}`;
        
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


export const loginClient= async(req:Request,res:Response,next:NextFunction)=>{
try {
  const {email,password}= req.body;


  if(!email || !password ){  return res.status(400).json({
        success: false,
        message: "Email and password are required",
      }); }

 const client = await Client.findOne({
    email,active:true
 }).select("+password");



 if(!client){
       return res.status(404).json({
         success: false,
         message: "client not found",
       });
 }

 
 const todayDate = Date.now();
const validityDate = new Date(client.validity).getTime();

if (validityDate < todayDate) {
  return res.status(403).json({
    success: false,
    message: "Client account validity expired",
  });
}

 const compairPassword = await bcrypt.compare(password,client.password);

 if(!compairPassword){
     return res.status(401).json({
         success: false,
         message: "Invalid password",
       });
 }



 
 const token = await JWT.sign({id:client._id},  process.env.JWT_SECRET as string,{
     expiresIn:"60d"
 })


 return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });

} catch (error) {
  
    next(error)
}
}


interface IAuth extends Request{
  user:any
}

export const getClient = async(req:IAuth,res:Response,next:NextFunction)=>{
  
const user = req.user
return res.status(200).json({
  success:true,user
  
})

}