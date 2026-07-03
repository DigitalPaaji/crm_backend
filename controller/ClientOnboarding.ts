import type { NextFunction, Request, Response } from "express";
import ClientOnboarding from "../model/ClientOnboardingSchema";


export const createClientOnboarding = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      businessName,
      ownerName,
      email,
      phone,
      website,
      city,
      businessDesc,
      businessAge,

      ownerAgeRange,
      gender,
      customersLocation,
      incomeLevel,
      customersProblem,
      customersValues,

      brandPersonality,
      brandColors,
      logoStatus,
      brandAdmire,
      brandFeel,

      platforms,
      handles,
      followers,
      postFrequency,
      whatWorked,
      paidAdsBefore,

      competitors,
      competitorsBetter,
      youBetter,
      usp,

      primaryGoal,
      winIn3Months,
      visionIn1Year,
      avoidThis,

      budget,
      wantAds,
      budgetFlexibility,

      contentTypes,
      contentLanguage,
      contentAssets,
      noContent,
      inspirationAccounts,

      communicationChannel,
      updateFrequency,
      approval,
      digitalMarketingKnowledge,
      anythingElse,
    } = req.body;

    const requiredFields = [
      { key: "businessName", value: businessName },
      { key: "ownerName", value: ownerName },
      { key: "email", value: email },
      { key: "phone", value: phone },
      { key: "city", value: city },
      { key: "businessDesc", value: businessDesc },
      { key: "customersProblem", value: customersProblem },
    ];

    const missingFields = requiredFields
      .filter(
        (field) =>
          field.value === undefined ||
          field.value === null ||
          String(field.value).trim() === ""
      )
      .map((field) => field.key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
        missingFields,
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const onboarding = await ClientOnboarding.create({
      businessName: String(businessName).trim(),
      ownerName: String(ownerName).trim(),
      email: normalizedEmail,
      phone: String(phone).trim(),
      website: website?.trim() || "",
      city: String(city).trim(),
      businessDesc: String(businessDesc).trim(),
      businessAge: businessAge || "",

      ownerAgeRange: ownerAgeRange || "",
      gender: gender || "",
      customersLocation: customersLocation || "",
      incomeLevel: incomeLevel || "",
      customersProblem: String(customersProblem).trim(),

      customersValues: Array.isArray(customersValues)
        ? customersValues
        : customersValues
          ? [customersValues]
          : [],

      brandPersonality: Array.isArray(brandPersonality)
        ? brandPersonality
        : brandPersonality
          ? [brandPersonality]
          : [],

      brandColors: brandColors || "",
      logoStatus: logoStatus || "",
      brandAdmire: brandAdmire || "",
      brandFeel: brandFeel || "",

      platforms: Array.isArray(platforms)
        ? platforms
        : platforms
          ? [platforms]
          : [],

      handles: handles || "",
      followers: followers || "",
      postFrequency: postFrequency || "",
      whatWorked: whatWorked || "",
      paidAdsBefore: paidAdsBefore || "",

      competitors: competitors || "",
      competitorsBetter: competitorsBetter || "",
      youBetter: youBetter || "",
      usp: usp || "",

      primaryGoal: primaryGoal || "",
      winIn3Months: winIn3Months || "",
      visionIn1Year: visionIn1Year || "",
      avoidThis: avoidThis || "",

      budget: budget || "",
      wantAds: wantAds || "",
      budgetFlexibility: budgetFlexibility || "",

      contentTypes: Array.isArray(contentTypes)
        ? contentTypes
        : contentTypes
          ? [contentTypes]
          : [],

      contentLanguage: contentLanguage || "",
      contentAssets: contentAssets || "",
      noContent: noContent || "",
      inspirationAccounts: inspirationAccounts || "",

      communicationChannel: communicationChannel || "",
      updateFrequency: updateFrequency || "",
      approval: approval || "",
      digitalMarketingKnowledge: digitalMarketingKnowledge || "",
      anythingElse: anythingElse || "",
    });

    return res.status(201).json({
      success: true,
      message: "Client onboarding form submitted successfully.",
      onboarding,
    });
  } catch (error) {
    next(error);
  }
};

export const GetClientBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clients = await ClientOnboarding.find()
      .select("businessName ownerName email phone city createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      total: clients.length,
      clients,
    });
  } catch (error) {
    next(error);
  }
};

export const GetClientBoardSingle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {id} = req.params
    const client = await ClientOnboarding.findById(id)
      

    return res.status(200).json({
      success: true,


      client,
    });
  } catch (error) {
    next(error);
  }
};