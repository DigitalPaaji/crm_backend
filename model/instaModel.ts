import mongoose, { Schema } from "mongoose";

const InstaUserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
    },

    profileImage: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
      required: true,
      index: true,
    },

    

    appId: {
      type: String,
      required: true,
    },

    appSecret: {
      type: String,
      required: true,
      select: false,
    },

    pageId: {
      type: String,
      required: true,
    },

  

    pageAccessToken: {
      type: String,
      required: true,
      select: false,
    },

    instagramBusinessId: {
      type: String,
    },

    instagramUserId: {
      type: String,
    },

    tokenType: {
      type: String,
      default: "bearer",
    },

    tokenExpiresAt: {
      type: Date,
    },

    lastRefreshToken: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("insta_user", InstaUserSchema);