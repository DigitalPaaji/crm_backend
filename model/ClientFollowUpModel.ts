import { Schema } from "mongoose";

const followUpSchema = new Schema({
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
}



},{timestamps:true})
