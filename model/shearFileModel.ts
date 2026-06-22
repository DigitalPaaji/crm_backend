import mongoose, { Document, Schema } from "mongoose";

interface IFile {
  file: string;
  filetype: string;
}



interface IShear extends Document{
  files:IFile[];
  sendby:mongoose.Schema.Types.ObjectId,
  sendto:mongoose.Schema.Types.ObjectId,
  title:string,
  des:string,
  status:Boolean
}

const shearSchema = new Schema<IShear>({
   
    files:[{file:String,filetype:String}],
    sendby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"employee"
    },
    sendto:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"employee"
    },
    title:{
      type:String,
      default:""
    },
    des:{
     type:String,
      default:""
    },
   status:{
    type:Boolean,
    default:true
   }
},{
    timestamps:true
})


shearSchema.index({ sendby: 1});


shearSchema.index({ sendto: 1});


shearSchema.index({  createdAt: -1 });


const Shear= mongoose.model<IShear>("shear", shearSchema);

export default Shear;




