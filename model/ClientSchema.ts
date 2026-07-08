import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClient extends Document {
  ownername: string;
  agencyname: string;
  email: string;
  password: string;
  logo: string;
  validity: Date;
  active: boolean;
  lastlogin?: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    ownername: {
      type: String,
      required: true,
      trim: true,
    },

    agencyname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    logo: {
      type: String,
      default: "",
    },

    validity: {
      type: Date,
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    lastlogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Client: Model<IClient> =
  mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);

export default Client;