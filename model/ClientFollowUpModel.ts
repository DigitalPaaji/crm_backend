import mongoose, { Model, Schema, Types } from "mongoose";


export interface ILeadFollowUp extends Document {
  client: Types.ObjectId;
  lead: Types.ObjectId;

  note: string;
 

  nextFollowUp: Date;


  reminderSent: boolean;

}



const leadFollowUpSchema = new Schema<ILeadFollowUp>({
client:{
     type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
},
lead:{
      type: Schema.Types.ObjectId,
          ref: "ClientLead",
          required: true,
          index: true,
},

 note: {
      type: String,
      trim: true,
      maxlength: [2000, "Note cannot exceed 2000 characters"],
      default: "",
    },

      nextFollowUp: {
      type: Date,
      index: true,
    },

reminderSent: {
      type: Boolean,
      default: false,
    },


},{timestamps:true})

const LeadFollowUp: Model<ILeadFollowUp> =
  mongoose.models.LeadFollowUp ||
  mongoose.model<ILeadFollowUp>(
    "LeadFollowUp",
    leadFollowUpSchema
  );

  export default LeadFollowUp;