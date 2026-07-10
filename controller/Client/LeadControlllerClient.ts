

import { Request, Response, NextFunction } from "express";
import ClientReqLead from "../../model/ClientRequirments";

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
