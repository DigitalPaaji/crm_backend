import mongoose, { Schema, Document, Types } from "mongoose";

interface ILeadField {
  show: boolean;
  required: boolean;
  uniqued:boolean;
}

export interface IClientReqLead extends Document {
  client: Types.ObjectId;

  name: ILeadField;
  firstName: ILeadField;
  lastName: ILeadField;
  email: ILeadField;
  phone: ILeadField;
  alternatePhone: ILeadField;
  whatsappNumber: ILeadField;
  gender: ILeadField;
  age: ILeadField;
  dob: ILeadField;

  companyName: ILeadField;
  designation: ILeadField;
  industry: ILeadField;
  website: ILeadField;
  gstNumber: ILeadField;

  address: ILeadField;
  city: ILeadField;
  state: ILeadField;
  country: ILeadField;
  pincode: ILeadField;

  service: ILeadField;
  product: ILeadField;
  requirement: ILeadField;
  budget: ILeadField;
  timeline: ILeadField;
  quantity: ILeadField;
  projectType: ILeadField;

  source: ILeadField;
  leadSource: ILeadField;
  campaignName: ILeadField;
  adName: ILeadField;
  referralName: ILeadField;

  preferredContactMethod: ILeadField;
  preferredCallTime: ILeadField;
  message: ILeadField;
  note: ILeadField;

  attachment: ILeadField;
  image: ILeadField;
  document: ILeadField;

  customField1: ILeadField;
  customField2: ILeadField;
  customField3: ILeadField;
  customField4: ILeadField;
  customField5: ILeadField;

  active: boolean;
}

const LeadFieldSchema = new Schema<ILeadField>(
  {
    show: {
      type: Boolean,
      default: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    uniqued:{
         type: Boolean,
      default: false,
    }
  },
  { _id: false }
);
const ClientReqLeadSchema = new Schema<IClientReqLead>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      unique: true,
    },

    // Basic Details
    name: {
      type: LeadFieldSchema,
      default: { show: true, required: true },
    },

    firstName: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    lastName: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    email: {
      type: LeadFieldSchema,
      default: { show: true, required: true },
    },

    phone: {
      type: LeadFieldSchema,
      default: { show: true, required: true },
    },

    alternatePhone: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    whatsappNumber: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    gender: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    age: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    dob: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    // Company Details
    companyName: {
      type: LeadFieldSchema,
      default: { show: true, required: false },
    },

    designation: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    industry: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    website: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    gstNumber: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    // Location Details
    address: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    city: {
      type: LeadFieldSchema,
      default: { show: true, required: false },
    },

    state: {
      type: LeadFieldSchema,
      default: { show: true, required: false },
    },

    country: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    pincode: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    // Requirement Details
    service: {
      type: LeadFieldSchema,
      default: { show: true, required: false },
    },

    product: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    requirement: {
      type: LeadFieldSchema,
      default: { show: true, required: false },
    },

    budget: {
      type: LeadFieldSchema,
      default: { show: true, required: false },
    },

    timeline: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    quantity: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    projectType: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    // Marketing / Source Details
    source: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    leadSource: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    campaignName: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    adName: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    referralName: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    // Communication Details
    preferredContactMethod: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    preferredCallTime: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    message: {
      type: LeadFieldSchema,
      default: { show: true, required: false },
    },

    note: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    // File Upload
    attachment: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    image: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    document: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    // Extra
    customField1: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    customField2: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    customField3: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    customField4: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    customField5: {
      type: LeadFieldSchema,
      default: { show: false, required: false },
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ClientReqLead =
  mongoose.models.ClientReqLead ||
  mongoose.model<IClientReqLead>("ClientReqLead", ClientReqLeadSchema);

export default ClientReqLead;