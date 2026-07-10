import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IClientLead extends Document {
  client: Types.ObjectId;

  // Basic details
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  whatsappNumber?: string;
  gender?: "male" | "female" | "other" | "";
  age?: number;
  dob?: Date;

  // Company details
  companyName?: string;
  designation?: string;
  industry?: string;
  website?: string;
  gstNumber?: string;

  // Location details
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;

  // Requirement details
  service?: string;
  product?: string;
  requirement?: string;
  budget?: string;
  timeline?: string;
  quantity?: number;
  projectType?: string;

  // Marketing details
  source?: string;
  leadSource?: string;
  campaignName?: string;
  adName?: string;
  referralName?: string;

  // Communication details
  preferredContactMethod?: string;
  preferredCallTime?: string;
  message?: string;
  note?: string;

  // Uploaded files
  attachment?: string[];
  image?: string[];
  document?: string[];

  // Custom fields
  customField1?: string;
  customField2?: string;
  customField3?: string;
  customField4?: string;
  customField5?: string;

  // CRM fields
  status:
    | "new"
    | "contacted"
    | "follow_up"
    | "qualified"
    | "proposal"
    | "converted"
    | "lost";

  assignedTo?: Types.ObjectId;
  createdBy?: Types.ObjectId;

  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const ClientLeadSchema = new Schema<IClientLead>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },

   
    name: {
      type: String,
      trim: true,
      default: "",
    },

    firstName: {
      type: String,
      trim: true,
      default: "",
    },

    lastName: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    alternatePhone: {
      type: String,
      trim: true,
      default: "",
    },

    whatsappNumber: {
      type: String,
      trim: true,
      default: "",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },

    age: {
      type: Number,
      min: 0,
      max: 150,
      default: undefined,
    },

    dob: {
      type: Date,
      default: undefined,
    },

    // Company details
    companyName: {
      type: String,
      trim: true,
      default: "",
    },

    designation: {
      type: String,
      trim: true,
      default: "",
    },

    industry: {
      type: String,
      trim: true,
      default: "",
    },

    website: {
      type: String,
      trim: true,
      default: "",
    },

    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },

    // Location details
    address: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    state: {
      type: String,
      trim: true,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      default: "",
    },

    pincode: {
      type: String,
      trim: true,
      default: "",
    },

    // Requirement details
    service: {
      type: String,
      trim: true,
      default: "",
    },

    product: {
      type: String,
      trim: true,
      default: "",
    },

    requirement: {
      type: String,
      trim: true,
      default: "",
    },

    /*
     Keep budget as String because it can contain:
     "₹50,000", "20k-50k", "Negotiable", etc.
    */
    budget: {
      type: String,
      trim: true,
      default: "",
    },

    timeline: {
      type: String,
      trim: true,
      default: "",
    },

    quantity: {
      type: Number,
      min: 0,
      default: undefined,
    },

    projectType: {
      type: String,
      trim: true,
      default: "",
    },

    // Marketing/source details
    source: {
      type: String,
      trim: true,
      default: "",
    },

    leadSource: {
      type: String,
      trim: true,
      default: "",
    },

    campaignName: {
      type: String,
      trim: true,
      default: "",
    },

    adName: {
      type: String,
      trim: true,
      default: "",
    },

    referralName: {
      type: String,
      trim: true,
      default: "",
    },

    // Communication details
    preferredContactMethod: {
      type: String,
      trim: true,
      default: "",
    },

    preferredCallTime: {
      type: String,
      trim: true,
      default: "",
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },

    // Files
    attachment: {
      type: [String],
      default: [],
    },

    image: {
      type: [String],
      default: [],
    },

    document: {
      type: [String],
      default: [],
    },

    // Custom fields
    customField1: {
      type: String,
      trim: true,
      default: "",
    },

    customField2: {
      type: String,
      trim: true,
      default: "",
    },

    customField3: {
      type: String,
      trim: true,
      default: "",
    },

    customField4: {
      type: String,
      trim: true,
      default: "",
    },

    customField5: {
      type: String,
      trim: true,
      default: "",
    },

    
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "follow_up",
        "qualified",
        "proposal",
        "converted",
        "lost",
      ],
      default: "new",
      index: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
 Useful indexes for CRM filtering and searching.
*/
ClientLeadSchema.index({ client: 1, createdAt: -1 });
ClientLeadSchema.index({ client: 1, status: 1 });
ClientLeadSchema.index({ client: 1, assignedTo: 1 });
ClientLeadSchema.index({ client: 1, phone: 1 });
ClientLeadSchema.index({ client: 1, email: 1 });

const ClientLead: Model<IClientLead> =
  mongoose.models.ClientLead ||
  mongoose.model<IClientLead>("ClientLead", ClientLeadSchema);

export default ClientLead;