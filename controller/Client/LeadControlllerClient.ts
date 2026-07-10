

import { Request, Response, NextFunction } from "express";
import ClientReqLead from "../../model/ClientRequirments";
import ClientLead from "../../model/ClientLeadModel";

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






export const createLead= async(  req: IAuth,
  res: Response,
  next: NextFunction)=>{
  try {
       const user = req.user

         if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }
const clientId = user._id;


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
        leadData[fieldKey] =
          typeof value === "string" ? value.trim() : value;
      }
    }
 if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required lead fields",
        missingFields,
      });
    }


 const lead = await ClientLead.create({
      ...leadData,
      client: clientId,
      createdBy: user._id,
      status: "new",
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
