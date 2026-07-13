

import type { Request, Response, NextFunction } from "express";
import ClientReqLead from "../../model/ClientRequirments";
import ClientLead from "../../model/ClientLeadModel";
import LeadFollowUp from "../../model/ClientFollowUpModel";

const allowedLeadFields = [
  "name",
  "firstName",
  "lastName",
  "email",
  "phone",
  "alternatePhone",
  "whatsappNumber",
  "gender",
  "age",
  "dob",

  "companyName",
  "designation",
  "industry",
  "website",
  "gstNumber",

  "address",
  "city",
  "state",
  "country",
  "pincode",

  "service",
  "product",
  "requirement",
  "budget",
  "timeline",
  "quantity",
  "projectType",

  "source",
  "leadSource",
  "campaignName",
  "adName",
  "referralName",

  "preferredContactMethod",
  "preferredCallTime",
  "message",
  "note",

  "attachment",
  "image",
  "document",

  "customField1",
  "customField2",
  "customField3",
  "customField4",
  "customField5",
];



interface IAuth extends Request{
    user:any
}

export const createOrUpdateClientReqLead = async (
  req: IAuth,
  res: Response,
  next: NextFunction
) => {
  try {
    const user  = req.user;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Client id is required",
      });
    }

    const updateData: Record<string, any> = {};

    allowedLeadFields.forEach((field) => {
      const value = req.body[field];

      if (value && typeof value === "object") {
        if (typeof value.show === "boolean") {
          updateData[`${field}.show`] = value.show;
        }

        if (typeof value.required === "boolean") {
          updateData[`${field}.required`] = value.required;
        }
         if (typeof value.required === "boolean") {
          updateData[`${field}.uniqued`] = value.uniqued;
        }
      }
    });

    if (typeof req.body.active === "boolean") {
      updateData.active = req.body.active;
    }

    const userid = user._id
    const leadRequirement = await ClientReqLead.findOneAndUpdate(
      { client:userid },
      {
        $set: updateData,
        $setOnInsert: { client:userid },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Client lead requirement saved successfully",
      data: leadRequirement,
    });
  } catch (error) {
    next(error);
  }
};

export const getReq= async( req: IAuth,
  res: Response,
  next: NextFunction)=>{
try {
    
 const user  = req.user;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Client id is required",
      });
    }

    const requirement = await ClientReqLead.findOne({client:user._id})
    
return res.status(200).json({
      success: true,
      data:requirement,
    });

} catch (error) {
    next(error)
}
}


export const getClientLeadVisibleFields = async (
  req: IAuth,
  res: Response,
  next: NextFunction
) => {
  try {
   const user = req.user

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Client id is required",
      });
    }

    const leadRequirement = await ClientReqLead.findOne({
      client: user._id,
      active: true,
    }).lean();

    if (!leadRequirement) {
      return res.status(404).json({
        success: false,
        message: "Lead requirement not found",
        fields: [],
      });
    }

    const fields = allowedLeadFields
      .filter((field) => leadRequirement[field]?.show === true)
      .map((field) => ({
        key: field,
        show: leadRequirement[field].show,
        required: leadRequirement[field].required,
      }));

    return res.status(200).json({
      success: true,
      message: "Visible lead fields fetched successfully",
      count: fields.length,
      fields,
    });
  } catch (error) {
    next(error);
  }
};

type allowedLeadFields = (typeof allowedLeadFields)[number];


const isEmptyValue = (value: unknown): boolean => {
  if (value === undefined || value === null) return true;

  if (typeof value === "string" && value.trim() === "") {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  return false;
};






export const createLead= async(  req: IAuth,res: Response,next: NextFunction)=>{
  try {
       const user = req.user

         if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }
const clientId = user._id;
    const {subclientid} =req.body


    const leadConfiguration = await ClientReqLead.findOne({
      client: clientId,
      active: true,
    }).lean();




 if (!leadConfiguration) {
      return res.status(404).json({
        success: false,
        message: "Lead form configuration not found",
      });
    }


    const leadData: Partial<Record<allowedLeadFields, unknown>> = {};
    const missingFields: allowedLeadFields[] = [];
    const uniqueFields: allowedLeadFields[] = [];

  for (const fieldKey of allowedLeadFields) {
      const fieldConfiguration = leadConfiguration[fieldKey];

      if (!fieldConfiguration?.show) {
        continue;
      }

      const value = req.body[fieldKey];

      if (fieldConfiguration.required && isEmptyValue(value)) {
        missingFields.push(fieldKey);
        continue;
      }

      if (!isEmptyValue(value)) {
         const cleanValue =
          typeof value === "string"
            ? value.trim()
            : value;
         leadData[fieldKey] = cleanValue;

        if (fieldConfiguration.uniqued) {
          uniqueFields.push(fieldKey);
        }
      }


    }
 if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required lead fields",
        missingFields,
      });
    }
 const uniqueChecks = await Promise.all(
      uniqueFields.map(async (fieldKey) => {
        const value = leadData[fieldKey];

        const existingLead = await ClientLead.findOne({
          client: clientId,
          [fieldKey]: value,
        })
          .collation({
            locale: "en",
            strength: 2,
          })
          .select(`_id ${fieldKey}`)
          .lean();

        return {
          fieldKey,
          value,
          exists: Boolean(existingLead),
          leadId: existingLead?._id,
        };
      })
    );


     const duplicateFields = uniqueChecks
      .filter((item) => item.exists)
      .map((item) => ({
        field: item.fieldKey,
        value: item.value,
        leadId: item.leadId,
      }));

    if (duplicateFields.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          duplicateFields.length === 1
            ? `Lead already exists with this ${duplicateFields[0].field}`
            : "Lead already exists with one or more unique fields",
        duplicateFields,
      });
    }

 const lead = await ClientLead.create({
      ...leadData,
      client: clientId,
      createdBy: user._id,
      status: "new",
      subclient:subclientid || null  ,
      active: true,
    });


     return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead,
    });

  } catch (error) {
    next(error)
  }
}








export const getLeads = async(req:IAuth,res:Response,next:NextFunction)=>{
  try {
     const { sort  } = req.query;
    const user = req.user
    
     const query: any = {
      client: user._id,
    };
    const now = new Date();


   if (sort === "today") {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  query.createdAt = {
    $gte: startOfDay,
    $lte: endOfDay,
  };
}
     if (sort === "week") {
      const startOfWeek = new Date();
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date();
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      query.createdAt = {
        $gte: startOfWeek,
        $lte: endOfWeek,
      };
     }

       if (sort === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: startOfMonth,
        $lte: endOfMonth,
      };
    }
      if (sort === "year") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      startOfYear.setHours(0, 0, 0, 0);

      const endOfYear = new Date(now.getFullYear(), 11, 31);
      endOfYear.setHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: startOfYear,
        $lte: endOfYear,
      };
    }


 const leads = await ClientLead.find(query).populate({path:"subclient"}).sort({ createdAt: -1 });

   return res.status(200).json({
      success: true,
      message: "Leads fetched successfully",
      // sort,
      count: leads.length,
      leads,
    });


  } catch (error) {
     next(error);
  }
}
export const getMyLead = async(req:IAuth,res:Response,next:NextFunction)=>{
try {

  const {leadid}= req.params
  const user = req.user;
   if (!leadid) {
      return res.status(400).json({
        success: false,
        message: "Lead id is required",
      });
    }
  const lead = await ClientLead.findOne({_id:leadid,client:user._id}).lean();
  
   if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }
 const filteredLead: Record<string, any> = {};

    Object.entries(lead).forEach(([key, value]) => {
      if (value === "") return;
      if (value === null) return;
      if (value === undefined) return;
      if (Array.isArray(value) && value.length === 0) return;

      filteredLead[key] = value;
    });
      return res.status(200).json({
      success: true,
      message: "Lead fetched successfully",
      lead:filteredLead,
    });
} catch (error) {
  next(error)
}
}



export const leadFollowUpCreate= async(req:IAuth,res:Response,next:NextFunction)=>{
try {
  const {leadid}  = req.params;
  const user = req.user;
  const { note, nextFollowUp, reminderSent = false } = req.body;

    const followUpDate = new Date(nextFollowUp);
  if (Number.isNaN(followUpDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid next follow-up date",
      });
    }

       const lead = await ClientLead.findOne({
      _id: leadid,
      client: user._id,
      active: true,
    });

if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const followUp = await LeadFollowUp.create({
      client: user._id,
      lead: lead._id,
      note: note?.trim() || "",
      nextFollowUp: followUpDate,
      reminderSent: Boolean(reminderSent),
   
    });

      if (lead.status === "new") {
      lead.status = "follow_up";
     
    }

if(followUpDate){
  lead.nextFollowUp= followUpDate
}
     await lead.save();

return res.status(201).json({
      success: true,
      message: "Lead follow-up created successfully",
      followUp,
    });

} catch (error) {
  next(error)
}
}

export const getLeadsFollowup = async(req:IAuth,res:Response,next:NextFunction)=>{
try {
  
  const {leadid} = req.params
  const user = req.user;

  const leads = await LeadFollowUp.find({client:user._id,lead:leadid});

  return res.status(200).json({
    success:true,
    followUps:leads
  })


} catch (error) {
  next(error)
}
}

export const deletLead = async(req:IAuth,res:Response,next:NextFunction)=>{
  try {
    const {leadid}= req.params;
    const user =  req.user;
     if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }
    const lead = await ClientLead.findOne({_id:leadid,client:user._id});
     if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

await Promise.all([
      LeadFollowUp.deleteMany({
        client: user._id,
        lead: lead._id,
      }),
      lead.deleteOne(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Lead and its follow-ups deleted successfully",
    });
    
  } catch (error) {
    next(error)
  }
}