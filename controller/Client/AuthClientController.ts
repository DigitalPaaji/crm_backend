
import type { NextFunction, Request, Response } from "express";
import { sendWelcomeEmail } from "../../helper/sendMail";
import bcrypt from "bcryptjs"
import Client from "../../model/ClientSchema";
import JWT from "jsonwebtoken"
import ClientSubUser from "../../model/SubClientModel";
import ClientLead from "../../model/ClientLeadModel";
import LeadFollowUp from "../../model/ClientFollowUpModel";


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

export const getClients = async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const clients = await Client.find()
    return res.status(200).json({success:true,clients})
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


export const updateClientById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { clientid } = req.params;
    const { active, website, subUserCount } = req.body;


    const updateData: {
      active?: boolean;
      website?: boolean;
      subUserCount?: number;
    } = {};

    if (typeof active === "boolean") {
      updateData.active = active;
    }

    if (typeof website === "boolean") {
      updateData.website = website;
    }

    if (subUserCount !== undefined) {
      const count = Number(subUserCount);

      if (!Number.isInteger(count) || count < 0 || count > 10) {
        return res.status(400).json({
          success: false,
          message: "Sub-user count must be between 0 and 10",
        });
      }

      updateData.subUserCount = count;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const client = await Client.findByIdAndUpdate(
      clientid,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    next(error);
  }
};


export const CreatSubUser = async(req:IAuth,res:Response,next:NextFunction)=>{
try {
  
const user = req.user;
if (!user?._id) { return res.status(401).json({ success: false, message: "Unauthorized access", }); }
const { name, email, password, access = [], status = true } = req.body;
if (!name?.trim() || !email?.trim() || !password) { return res.status(400).json({ success: false, message: "Name, email and password are required", }); }
if (password.length < 6) { return res.status(400).json({ success: false, message: "Password must be at least 6 characters", }); }
if (!Array.isArray(access)) { return res.status(400).json({ success: false, message: "Access must be an array", }); }


const client = await Client.findOne({ _id: user._id, active: true, });


if (!client) { return res.status(404).json({ success: false, message: "Active client account not found", }); }
if(client.subUserCount ==0){
  return res.status(409).json({ success: false, message: "You can't create sub user more", }); 
}
const normalizedEmail = email.toLowerCase().trim(); 
const alreadyExists = await ClientSubUser.findOne({ client: user._id, email: normalizedEmail, });
if (alreadyExists) { return res.status(409).json({ success: false, message: "Sub-user with this email already exists", }); }

 const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);


const subUser = await ClientSubUser.create({ client: user._id, name: name.trim(), email: normalizedEmail, password: hashedPassword, access, status, });


try { await sendWelcomeEmail(normalizedEmail, password); } catch (emailError) { console.error("Welcome email failed:", emailError); }

client.subUserCount = Number(client?.subUserCount) - 1
await client.save()
return res.status(201).json({ success: true, message: "Sub-user created successfully", subUser: { _id: subUser._id, client: subUser.client, name: subUser.name, email: subUser.email, access: subUser.access, status: subUser.status, lastLogin: subUser.lastLogin, createdAt: subUser.createdAt, }, });



} catch (error) {
  next(error)
}
}

export const getSubUser = async(req:IAuth,res:Response,next:NextFunction)=>{
  try {
    const user = req.user;

const subUsers = await ClientSubUser.find({ client: user._id, }) .select("-password") .sort({ createdAt: -1 }) .lean();

return res.status(200).json({ success: true, message: "Sub-users fetched successfully", count: subUsers.length, subUsers, });

  } catch (error) {
    next(error)
  }
}

export const getClientDetals= async(req:IAuth,res:Response,next:NextFunction)=>{
  try {
    const user = req.user;

    if (!user?._id) { return res.status(401).json({ success: false, message: "Unauthorized access", }); } 
    
    const clientId = user._id; 
    
    const client = await Client.findById(clientId) .select( "ownername agencyname email logo validity active website subUserCount lastlogin" ) .lean(); 
    
    if (!client) { return res.status(404).json({ success: false, message: "Client not found", }); } 
    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0); 
    const endOfToday = new Date(); endOfToday.setHours(23, 59, 59, 999); 
    const [ allLeads, newLeads, followUpLeads, convertedLeads, lostLeads, totalSubUsers, activeSubUsers, totalFollowUps, todayFollowUps, overdueFollowUps, upcomingFollowUps, ] = 
    await Promise.all([ ClientLead.countDocuments({ client: clientId, }),
       ClientLead.countDocuments({ client: clientId, status: "new", }),
        ClientLead.countDocuments({ client: clientId, status: "follow_up", }), 
        ClientLead.countDocuments({ client: clientId, status: "converted", }), 
        ClientLead.countDocuments({ client: clientId, status: "lost", }), 
        ClientSubUser.countDocuments({ client: clientId, }), 
        ClientSubUser.countDocuments({ client: clientId, status: true, }), 
        LeadFollowUp.countDocuments({ client: clientId, }), 
        LeadFollowUp.countDocuments({ client: clientId, date: { $gte: startOfToday, $lte: endOfToday, }, status: { $ne: "completed", }, }), 
        LeadFollowUp.countDocuments({ client: clientId, date: { $lt: startOfToday, }, status: { $ne: "completed", }, }), 
        LeadFollowUp.countDocuments({ client: clientId, date: { $gt: endOfToday, }, status: { $ne: "completed", }, }), ]);
         const conversionRate = allLeads > 0 ? Number(((convertedLeads / allLeads) * 100).toFixed(2)) : 0; 
    const lostRate = allLeads > 0 ? Number(((lostLeads / allLeads) * 100).toFixed(2)) : 0;
const recentLeads = await ClientLead.find({ client: clientId, }) .select( "name firstName lastName email phone status createdAt updatedAt" ) .sort({ createdAt: -1, }) .limit(5) .lean();
 const upcomingFollowUpList = await LeadFollowUp.find({ client: clientId, date: { $gte: startOfToday, }, status: { $ne: "completed", }, })
return res.status(200).json({ success: true, message: "Dashboard details fetched successfully", 
  dashboard: { client, leads: { total: allLeads, new: newLeads, followUp: followUpLeads, converted: convertedLeads, lost: lostLeads, conversionRate, lostRate, },
   subUsers: { total: totalSubUsers, active: activeSubUsers, inactive: totalSubUsers - activeSubUsers, }, 
   followUps: { total: totalFollowUps, today: todayFollowUps, 
    overdue: overdueFollowUps, upcoming: upcomingFollowUps, },
     recentLeads, upcomingFollowUps: upcomingFollowUpList, }, });
    
  } catch (error) {
    next(error)
  }
}
export const deleteSubClient = async(req:IAuth,res:Response,next:NextFunction)=>{
try {

  const {subclientid} = req.params;
  const user =  req.user;
  if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }
  
const subClient = await ClientSubUser.findOne({
      _id: subclientid,
      client: user._id,
    });
    
     if (!subClient) {
      return res.status(404).json({
        success: false,
        message: "Sub-user not found",
      });
    }

    await subClient.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Sub-user deleted successfully",
    });
} catch (error) {
  next(error)
}
}