import type { NextFunction, Request, Response } from "express";
import Lead from "../../model/leadsModels";
import { NetworkResources } from "node:inspector/promises";

interface Authuser extends Request{
    user : any
}



export const createLead=async(req:Authuser,res:Response,next:NextFunction)=>{
try {
const user = req.user

const  {name,email,phone,dob,mother,father,address,designation,education,source,notes} = req.body

 await Lead.create({name,email,phone,dob,mother,father,address,designation,education,source,notes,createdby:user._id})




  return res.status(201).json({
      success: true,
      message: "Lead created successfully", 
    });


} catch (error) {
    console.log(error)
    next(error)
}
}


export const getallLeads=async(req:Authuser,res:Response,next:NextFunction)=>{
try {
    const user = req.user;
     const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = limit * (page - 1);
   const totalLeads = await Lead.countDocuments({
      notdeleted: true,
    });


  const leads = await Lead.find({notdeleted:true})
      .skip(skip)
      .limit(limit).sort({ createdAt: -1 }).select("name email phone dob status source createdby").populate("createdby");

   return res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalLeads / limit),
      totalLeads,
      leads,
    });
} catch (error) {
    
}
    
}

export const getMyLeads=async(req:Authuser,res:Response,next:NextFunction)=>{
try {
    const user = req.user;
     const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = limit * (page - 1);
   const totalLeads = await Lead.countDocuments({
    createdby:user._id,
      notdeleted: true,
    });


  const leads = await Lead.find({createdby:user._id,notdeleted:true})
      .skip(skip)
      .limit(limit).sort({ createdAt: -1 }).select("name email phone dob status source createdby").populate("createdby");

   return res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalLeads / limit),
      totalLeads,
      leads,
    });
} catch (error) {
    
}
    
}



export const getSingleLead = async(req:Authuser,res:Response,next:NextFunction)=>{
    try {
        const {leadid} = req.params;
        const lead = await Lead.findById(leadid).populate({
    path: "createdby",
    select: "name email phone role",
  })
  .populate({
    path: "followup.by",
    select: "name email phone",
  });



    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }
       
    
        return res.status(200).json({
      success: true,
      lead,
    });
    } catch (error) {
        next(error)
    }
}



export const updateLeads = async(req:Authuser,res:Response,next:NextFunction)=>{
  try {
    const leadid = req.params.id;
   if (!leadid) {
      return res.status(400).json({
        success: false,
        message: "Lead id is required",
      });
    }

 const lead = await Lead.findById(leadid);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }



    const {
      name,
      email,
      phone,
      dob,
      mother,
      father,
      address,
      designation,
      education,
      status,
      source,
      followup,
      notes,
    } = req.body;
lead.email= email
lead.name= name
lead.phone= phone
lead.dob= dob
lead.mother= mother
lead.father= father
lead.address= address
lead.designation= designation
lead.education= education ? education :null
lead.status= status
lead.source= source
lead.followup= followup
lead.notes= notes
await  lead.save()

  return res.status(200).json({
      success: true,
      message: "Lead updated successfully",
     
    });

  } catch (error) {
    next(error)
  }
}

export const Followdup = async(req:Authuser,res:Response,next:NextFunction)=>{
try {
  const leadid = req.params.id
  const user = req.user
  const {date,note} = req.body

  const lead = await Lead.findById(leadid);
  
  if(!lead)
{
   return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
}
if (lead.followup.length) {
  const lastFollowup = lead.followup[lead.followup.length - 1];

  const lastDate = new Date(lastFollowup.date).getTime();
  const newDate = new Date(date).getTime();

  const diffMinutes = Math.abs(newDate - lastDate) / (1000 * 60);

  if (diffMinutes < 10) {
    return res.status(400).json({
      success: false,
      message: "Followup already added within 10 minutes",
    });
  }
}

lead.followup.push({
  date,
  by:user._id,
  note,

})

const latestFollowup = lead.followup[lead.followup.length - 1];

lead.lastFollowup = {
  date: new Date(date),
  followupid: latestFollowup._id,
};


   await lead.save();



await lead.save();


   await lead.populate([
      {
        path: "createdby",
        select: "name email phone role",
      },
      {
        path: "followup.by",
    select: "name email phone",
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Followup added successfully",
      data: lead,
    });
} catch (error) {
     next(error);
}
}




export const deleteFollowup = async (
  req: Authuser,
  res: Response,
  next: NextFunction
) => {
  try {
    const leadId = req.params.id;
    const user = req.user;

    const { followUpId } = req.body;

    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Find followup
    const followupLead = lead.followup.find(
      (item : any) => item._id.toString() === followUpId
    );

    if (!followupLead) {
      return res.status(404).json({
        success: false,
        message: "Followup not found",
      });
    }

    // Permission check
    if (
      followupLead.by.toString() !==
      user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your followup",
      });
    }

    // Delete followup
    lead.followup = lead.followup.filter(
      (item : any) => item._id.toString() !== followUpId
    );


if(lead?.lastFollowup.followupid==followUpId){
if(lead.followup.length == 0 ){
lead.lastFollowup={}

}else{
lead.lastFollowup = {
  date:lead.followup[lead.followup.length -1].date,
  followupid: lead.followup[lead.followup.length -1]?._id  || " "
}

}
 
  
}


    await lead.save();
//  lastFollowup

 await lead.populate([
      {
        path: "createdby",
        select: "name email phone role",
      },
      {
        path: "followup.by",
    select: "name email phone",
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Followup deleted successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const tempDelete = async (
  req: Authuser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const leadid = req.params.id;

    const lead = await Lead.findById(leadid);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

 
    if (
      lead.createdby.toString() !==
      user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to delete this lead",
      });
    }

    // Soft delete
    lead.notdeleted = false;

    await lead.save();

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
  
    });
  } catch (error) {
    next(error);
  }
};

//// admin ///


export const getallLeadsAdmin=async(req:Authuser,res:Response,next:NextFunction)=>{
try {
    
     const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = limit * (page - 1);
   const totalLeads = await Lead.countDocuments();


  const leads = await Lead.find()
      .skip(skip)
      .limit(limit).sort({ createdAt: -1 }).select("name email phone dob status source createdby").populate("createdby");

   return res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalLeads / limit),
      totalLeads,
      leads,
    });
} catch (error) {
    next(error)
}
    
}


export const DeleteLead = async (
  req: Authuser,
  res: Response,
  next: NextFunction
) => {
  try {
  
    const leadid = req.params.id;

    const lead = await Lead.findById(leadid);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }





 
 
await lead.deleteOne()


    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
  
    });
  } catch (error) {
    next(error);
  }
};


export const getLastFolowUps = async (
  req: Authuser,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const followupdata = Number(req.query.followupdata) || 3;

    const limit = 20;
    const skip = (page - 1) * limit;

    const filterDate = new Date();
    filterDate.setDate(filterDate.getDate() - followupdata);

    const query = {
      "lastFollowup.date": {
        $lte: filterDate,
      },
    };

// filterDate.setMinutes(filterDate.getMinutes() - followupdata);

// const query = {
//   "lastFollowup.date": {
//     $lte: filterDate,
//   },
// };

    const totalLeads = await Lead.countDocuments(query);

    const leads = await Lead.find(query)
      .select(
        "name email phone dob status source createdby lastFollowup"
      )
      .populate("createdby")
      .sort({ "lastFollowup.date": 1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      totalLeads,
      currentPage: page,
      totalPages: Math.ceil(totalLeads / limit),
      leads,
    });
  } catch (error) {
    next(error);
  }
};


export const getData = async(req: Authuser,res: Response,next: NextFunction)=>{
try {
  
  // const data = await 
} catch (error) {
  
}



}




