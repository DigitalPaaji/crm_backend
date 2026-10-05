import mongoose, { Document, model, Schema } from "mongoose";

interface IUPComing extends Document{
  leaddate:Date;  
  Followupid:string;
 leadid:mongoose.Schema.Types.ObjectId;
}


const UpCommingLeadSchema = new Schema<IUPComing>({
    leaddate:{
       type: Date, required: true
    },
    Followupid:{
        type:String,
        required:true,
    },
    leadid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Lead"
    } 




},{timestamps:true});


const UpCommmingFollowup = model<IUPComing>("UpcomingLead",UpCommingLeadSchema)

export default UpCommmingFollowup


