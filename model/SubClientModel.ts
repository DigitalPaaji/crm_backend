import mongoose, { Document, Schema, Types } from "mongoose";

export interface IClientSubUser extends Document {
  client: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  access: string[];
  status: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSubUserSchema = new Schema<IClientSubUser>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    access: {
      type: [String],
      default: [],
    },

    status: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Email unique for each client
ClientSubUserSchema.index(
  {
    client: 1,
    email: 1,
  },
  {
    unique: true,
  }
);

const ClientSubUser =
  mongoose.models.ClientSubUser ||
  mongoose.model<IClientSubUser>("ClientSubUser", ClientSubUserSchema);

export default ClientSubUser;