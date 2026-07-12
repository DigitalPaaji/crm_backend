import type { Request, Response, NextFunction } from "express";
import ClientSubUser from "../../model/SubClientModel";
import bcrypt from "bcryptjs"
import Client from "../../model/ClientSchema";
import JWT from "jsonwebtoken"
import ClientLead from "../../model/ClientLeadModel";
import LeadFollowUp from "../../model/ClientFollowUpModel";





interface IAuth extends Request{
    user:any
}
export const loginSubClient= async(req:Request,res:Response,next:NextFunction)=>{
try {

    const {email,password}= req.body;


    if (!email?.trim() || !password) 
        { return res.status(400).json({ success: false, message: "Email and password are required", }); }

    const normalizedEmail = email.toLowerCase().trim();
    const subUser = await ClientSubUser.findOne({email:normalizedEmail,status:true}).select("+password")
    if(!subUser){
return res.status(401).json({ success: false, message: "Invalid email or password", });
    }

const isPasswordCorrect = await bcrypt.compare(password,subUser.password);
if(!isPasswordCorrect){
    return res.status(401).json({ success: false, message: "Invalid email or password", });
}


const client = await Client.findOne({ _id: subUser.client, active: true, }).select( "ownername agencyname email logo validity active website" );



if(!client  ){
   return res.status(403).json({ success: false, message: "The main client account is inactive or unavailable", });
}


 const token = await JWT.sign({id:client._id},  process.env.JWT_SECRET as string,{
     expiresIn:"60d"
 })
subUser.lastLogin= new Date(Date.now())
await subUser.save()
 

 return res.status(200).json({
      success: true,
      message: "Login successful",
      
      token,
     user: { _id: subUser._id, client: client._id, name: subUser.name, email: subUser.email, access: subUser.access, status: subUser.status, lastLogin: subUser.lastLogin, role: "sub_user", }, 
     client: { _id: client._id, ownername: client.ownername, agencyname: client.agencyname, email: client.email, logo: client.logo, validity: client.validity, active: client.active, website: client.website, },
    });


    
} catch (error) {
    next(error)
}
}


export const getSubClientDetals= async(req:IAuth,res:Response,next:NextFunction)=>{
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