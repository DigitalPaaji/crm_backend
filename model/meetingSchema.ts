import mongoose, { Document, model, Schema } from "mongoose";

interface IMeeting extends Document{
    roomid:string;
    password:string;
    createby:mongoose.Schema.Types.ObjectId;
}


const meetingSchema = new Schema<IMeeting>({
    roomid:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    createby:{
        type:mongoose.Schema.Types.ObjectId,
       ref:"employee"
    }
},{
    timestamps:true
});



const Meeting = model<IMeeting>("meeting",meetingSchema)

export default Meeting;



