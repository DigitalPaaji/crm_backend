import mongoose, { Schema, model, models } from "mongoose";

const ClientOnboardingSchema = new Schema(
  {
    // Required fields
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
    },

    ownerName: {
      type: String,
      required: [true, "Owner name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    businessDesc: {
      type: String,
      required: [true, "Business description is required"],
      trim: true,
    },

    customersProblem: {
      type: String,
      required: [true, "Customer problem is required"],
      trim: true,
    },

    // Optional fields
    website: {
      type: String,
      trim: true,
      default: "",
    },

    businessAge: {
      type: String,
      default: "",
    },

    ownerAgeRange: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      default: "",
    },

    customersLocation: {
      type: String,
      default: "",
    },

    incomeLevel: {
      type: String,
      default: "",
    },

    customersValues: {
      type: [String],
      default: [],
    },

    brandPersonality: {
      type: [String],
      default: [],
    },

    brandColors: {
      type: String,
      default: "",
    },

    logoStatus: {
      type: String,
      default: "",
    },

    brandAdmire: {
      type: String,
      default: "",
    },

    brandFeel: {
      type: String,
      default: "",
    },

    platforms: {
      type: [String],
      default: [],
    },

    handles: {
      type: String,
      default: "",
    },

    followers: {
      type: String,
      default: "",
    },

    postFrequency: {
      type: String,
      default: "",
    },

    whatWorked: {
      type: String,
      default: "",
    },

    paidAdsBefore: {
      type: String,
      default: "",
    },

    competitors: {
      type: String,
      default: "",
    },

    competitorsBetter: {
      type: String,
      default: "",
    },

    youBetter: {
      type: String,
      default: "",
    },

    usp: {
      type: String,
      default: "",
    },

    primaryGoal: {
      type: String,
      default: "",
    },

    winIn3Months: {
      type: String,
      default: "",
    },

    visionIn1Year: {
      type: String,
      default: "",
    },

    avoidThis: {
      type: String,
      default: "",
    },

    budget: {
      type: String,
      default: "",
    },

    wantAds: {
      type: String,
      default: "",
    },

    budgetFlexibility: {
      type: String,
      default: "",
    },

    contentTypes: {
      type: [String],
      default: [],
    },

    contentLanguage: {
      type: String,
      default: "",
    },

    contentAssets: {
      type: String,
      default: "",
    },

    noContent: {
      type: String,
      default: "",
    },

    inspirationAccounts: {
      type: String,
      default: "",
    },

    communicationChannel: {
      type: String,
      default: "",
    },

    updateFrequency: {
      type: String,
      default: "",
    },

    approval: {
      type: String,
      default: "",
    },

    digitalMarketingKnowledge: {
      type: String,
      default: "",
    },

    anythingElse: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const ClientOnboarding =
  models.ClientOnboarding ||
  model("ClientOnboarding", ClientOnboardingSchema);

export default ClientOnboarding;