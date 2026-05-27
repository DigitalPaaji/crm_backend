import mongoose, { Schema, Document, Types } from "mongoose";

interface IFollowup {
  date: Date;
  by: Types.ObjectId;
note:string,
  _id?: string
  
}
interface ILastFollowup {
  date?: Date;
  followupid?: String | "";
}
export interface ILead extends Document {
  name?: string;
  email?: string;
  phone: string;

  dob?: Date;

  mother?: string;
  father?: string;
  address?: string;
  designation?: string;
  education?: "school" | "college" |"graduate" | "postgraduate" | "other" |null;
  status: "new" | "contacted" | "interested" | "converted" | "rejected";
  source?: string;
  followup: IFollowup[];
  notes?: string;
  createdby: Types.ObjectId;
  notdeleted:Boolean;
  createdAt: Date;
  updatedAt: Date;
  lastFollowup:ILastFollowup
}




const FollowupSchema = new Schema<IFollowup>(
  {
    date: { type: Date, required: true },
    by: { type: Schema.Types.ObjectId, ref: "employee", required: true },
    note:{
      type:String,
    }
  },
  {
    _id:true
  }
);



const LeadsSchema = new Schema<ILead>(
  {
    name: { type: String, trim: true,  maxlength: 100 },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    phone: {
      type: String,
    
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid Indian phone number"],
    },

    dob: { type: Date },

    mother: { type: String, trim: true },
    father: { type: String, trim: true },

    address: { type: String, trim: true, maxlength: 300 },

    designation: { type: String, trim: true },

    education: { type: String,
      enum: ["school", "college", "graduate", "postgraduate", "other",null],
      default:null
    }
      
      ,

    status: {
      type: String,
      enum: ["new", "contacted", "interested", "converted", "rejected"],
      default: "new",
    },

    source: { type: String, default: "manual" },

    followup: { type: [FollowupSchema], default: [] },


   lastFollowup : {
    date:{ type: Date },
    followupid:{
      type:String,
      default :""
    }
   },


    notes: { type: String, maxlength: 1000 },
    createdby:{
   type: Schema.Types.ObjectId, ref: "employee", required: true
    },
notdeleted:{
    type:Boolean,
default:true
}

  },
  { timestamps: true }
);

// indexes
LeadsSchema.index({ email: 1 });
LeadsSchema.index({ phone: 1 });
LeadsSchema.index({ status: 1 });

export default mongoose.model<ILead>("Lead", LeadsSchema);