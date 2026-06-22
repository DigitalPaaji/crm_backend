import type { NextFunction, Request, Response } from "express";
import InstaUser from "../../model/instaModel";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { uploadVideoToCloudinary } from "../../helper/uploadVideoToCloudinary";
dotenv.config();

interface AuthReq extends Request {
  user: any;
}

export const CreateInstaAcc = async (
  req: AuthReq,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, appId, appSecret, pageId, pageAccessToken } = req.body;
    const createdBy = req.user._id;

    const igResponse = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`,
    );

    const igData = await igResponse.json();
    console.log(igData, createdBy);
    const instagramBusinessId = igData.instagram_business_account?.id;

    let username = "";
    let profileImage = "";

    if (instagramBusinessId) {
      const profileResponse = await fetch(
        `https://graph.facebook.com/v19.0/${instagramBusinessId}?fields=username,profile_picture_url&access_token=${pageAccessToken}`,
      );

      const profileData = await profileResponse.json();

      if (profileResponse.ok) {
        username = profileData.username;
        profileImage = profileData.profile_picture_url;
      }
      console.log(profileData, username, profileImage);
    }

    const socialAccount = await InstaUser.create({
      name,
      username,
      profileImage,

      createdBy,

      appId,
      appSecret,

      pageId,

      pageAccessToken,

      instagramBusinessId,

      lastRefreshToken: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Instagram account connected successfully",
      data: socialAccount,
    });
  } catch (error) {
    next(error);
  }
};

export const GetAllAccount = async (
  req: AuthReq,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allInsat = await InstaUser.find()
      .select(" name username profileImage createdBy")
      .populate({ path: "createdBy", select: "name email" });

    return res.status(200).json({
      success: true,
      data: allInsat,
    });
  } catch (error) {
    next(error);
  }
};

export const GetInstaPage = async (
  req: AuthReq,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;

    /*
      GET ACCOUNT FROM DB
    */

    const instaAcc = await InstaUser.findById(id)
      .populate({
        path: "createdBy",
        select: "name email",
      })
      .select("+pageAccessToken");

    if (!instaAcc) {
      return res.status(404).json({
        success: false,
        message: "Instagram account not found",
      });
    }

    /*
      PROFILE API
    */

    const profileResponse = await fetch(
      `https://graph.facebook.com/v19.0/${instaAcc.instagramBusinessId}?fields=id,username,name,biography,website,followers_count,follows_count,media_count,profile_picture_url&access_token=${instaAcc.pageAccessToken}`,
    );

    const profileData = await profileResponse.json();

    /*
      POSTS API
    */

    const postsResponse = await fetch(
      `https://graph.facebook.com/v19.0/${instaAcc.instagramBusinessId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&access_token=${instaAcc.pageAccessToken}`,
    );

    const postsData = await postsResponse.json();

    /*
      HANDLE GRAPH ERRORS
    */

    if (!profileResponse.ok || !postsResponse.ok) {
      return res.status(400).json({
        success: false,
        profileError: !profileResponse.ok ? profileData : null,
        postsError: !postsResponse.ok ? postsData : null,
      });
    }

    /*
      REMOVE SENSITIVE DATA
    */

    // const safeAccount = instaAcc.toObject();

    instaAcc.pageAccessToken = "";
    //  safeAccount?.appSecret=null;

    /*
      RESPONSE
    */

    return res.status(200).json({
      success: true,

      account: instaAcc,

      profile: profileData,

      posts: postsData.data,
    });
  } catch (error) {
    next(error);
  }
};

export const SearchLocation = async (
  req: AuthReq,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { q } = req.query;
    const { accountId } = req.params;
    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: "accountId is required",
      });
    }
    const instaAcc =
      await InstaUser.findById(accountId).select("+pageAccessToken");

    if (!instaAcc) {
      return res.status(404).json({
        success: false,
        message: "Instagram account not found",
      });
    }

    const response = await fetch(
      // `https://graph.facebook.com/v19.0/search?q=${q}&type=place&access_token=${instaAcc.pageAccessToken}`
      `https://graph.facebook.com/v19.0/pages/search?q=${q}&fields=id,name,location&access_token=${instaAcc.pageAccessToken}`,
    );

    const data = await response.json();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

cloudinary.config({
  cloud_name: "domgidptm",
  api_key: "778121423134461",
  api_secret: process.env.CLOUDNERY_SECRET_KEY,
});

export const CreatePost = async (
  req: AuthReq,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accountId, caption, usertags } = req.body;

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: "accountId is required",
      });
    }

    const file = req?.file as any
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    let user_tags = [];

    try {
      user_tags = usertags ? JSON.parse(usertags) : [];
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid usertags JSON",
      });
    }

    const instaAcc =
      await InstaUser.findById(accountId).select("+pageAccessToken");

    if (!instaAcc) {
      return res.status(404).json({
        success: false,
        message: "Instagram account not found",
      });
    }

    if (!instaAcc.instagramBusinessId) {
      return res.status(400).json({
        success: false,
        message: "Instagram business account not connected",
      });
    }

    // UPLOAD IMAGE TO CLOUDINARY
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "uploads",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(file?.buffer as any);
    });

    const imageurl: string = uploadResult.secure_url;
    const public_id: string = uploadResult.public_id;

    // CREATE MEDIA CONTAINER
    const createContainerResponse = await fetch(
      `https://graph.facebook.com/v19.0/${instaAcc.instagramBusinessId}/media`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          image_url: imageurl,
          caption: caption || "",
          user_tags,
          access_token: instaAcc.pageAccessToken,
        }),
      },
    );

    const createContainerData = await createContainerResponse.json();

    if (!createContainerResponse.ok) {
      // DELETE IMAGE
      await cloudinary.uploader.destroy(public_id);

      return res.status(400).json({
        success: false,
        step: "CREATE_CONTAINER_FAILED",
        error: createContainerData,
      });
    }

    // PUBLISH POST
    const publishResponse = await fetch(
      `https://graph.facebook.com/v19.0/${instaAcc.instagramBusinessId}/media_publish`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          creation_id: createContainerData.id,
          access_token: instaAcc.pageAccessToken,
        }),
      },
    );

    const publishData = await publishResponse.json();

    // DELETE IMAGE AFTER POST
    await cloudinary.uploader.destroy(public_id);

    if (!publishResponse.ok) {
      return res.status(400).json({
        success: false,
        error: publishData,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Instagram post published successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const Create_Video_Post = async (
  req: AuthReq,
  res: Response,
  next: NextFunction,
) => {
  try {
    /*
      BODY DATA
    */

    const { media_type, caption, thumb_offset, share_to_feed, accountId } =
      req.body;

    /*
      VALIDATION
    */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video is required",
      });
    }

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: "accountId is required",
      });
    }

    /*
      GET INSTAGRAM ACCOUNT
    */

    const instaAcc =
      await InstaUser.findById(accountId).select("+pageAccessToken");

    if (!instaAcc) {
      return res.status(404).json({
        success: false,
        message: "Instagram account not found",
      });
    }

    /*
      CHECK IG BUSINESS ID
    */

    if (!instaAcc.instagramBusinessId) {
      return res.status(400).json({
        success: false,
        message: "Instagram Business Account not connected",
      });
    }

    /*
      UPLOAD VIDEO TO CLOUDINARY
    */

    const cloudinaryResponse = await uploadVideoToCloudinary(req.file.buffer);

    const video_url: string = cloudinaryResponse.secure_url;
    const public_id: string = cloudinaryResponse.public_id;
    /*
      CREATE MEDIA CONTAINER
    */

    const createContainerResponse = await fetch(
      `https://graph.facebook.com/v19.0/${instaAcc.instagramBusinessId}/media`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          media_type: "REELS",
          video_url,
          caption: caption || "",
          thumb_offset: thumb_offset || 3000,
          share_to_feed: share_to_feed || true,
          access_token: instaAcc.pageAccessToken,
        }),
      },
    );

    const createContainerData = await createContainerResponse.json();

    /*
      HANDLE CONTAINER ERROR
    */

    if (!createContainerResponse.ok) {
      await cloudinary.uploader.destroy(public_id);
      return res.status(400).json({
        success: false,
        step: "CREATE_CONTAINER_FAILED",

        error: createContainerData,
      });
    }

    /*
      CREATION ID
    */

    const creationId = createContainerData.id;

    let status = "IN_PROGRESS";

    let retryCount = 0;

    /*
      MAX 20 RETRIES
    */

    while (status === "IN_PROGRESS" && retryCount < 20) {
      /*
        WAIT 5 SECONDS
      */

      await new Promise((resolve) => setTimeout(resolve, 5000));

      /*
        CHECK STATUS
      */

      const statusResponse = await fetch(
        `https://graph.facebook.com/v19.0/${creationId}?fields=status_code&access_token=${instaAcc.pageAccessToken}`,
      );

      const statusData = await statusResponse.json();

      status = statusData.status_code;

      /*
        VIDEO FAILED
      */
      await cloudinary.uploader.destroy(public_id);
      if (status === "ERROR") {
        return res.status(400).json({
          success: false,

          step: "VIDEO_PROCESSING_FAILED",

          statusData,
        });
      }

      retryCount++;
    }

    /*
      VIDEO NOT READY
    */

    if (status !== "FINISHED") {
      return res.status(400).json({
        success: false,

        message: "Video processing timeout",

        status,
      });
    }

    /*
      PUBLISH VIDEO
    */

    const publishResponse = await fetch(
      `https://graph.facebook.com/v19.0/${instaAcc.instagramBusinessId}/media_publish`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          creation_id: creationId,

          access_token: instaAcc.pageAccessToken,
        }),
      },
    );

    const publishData = await publishResponse.json();

    /*
      HANDLE PUBLISH ERROR
    */

    if (!publishResponse.ok) {
      return res.status(400).json({
        success: false,

        step: "PUBLISH_FAILED",

        error: publishData,
      });
    }

    /*
      SUCCESS
    */

    return res.status(200).json({
      success: true,

      message: "Video published successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const Create_Story_Post_Image = async (
  req: AuthReq,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accountId } = req.body;

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: "accountId is required",
      });
    }

    const file = req.file as Express.Multer.File;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const instaAcc =
      await InstaUser.findById(accountId).select("+pageAccessToken");

    if (!instaAcc) {
      return res.status(404).json({
        success: false,
        message: "Instagram account not found",
      });
    }

    if (!instaAcc.instagramBusinessId) {
      return res.status(400).json({
        success: false,
        message: "Instagram business account not connected",
      });
    }
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "uploads",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(file?.buffer as any);
    });

    const imageurl: string = uploadResult.secure_url;
    const public_id: string = uploadResult.public_id;

    const createContainerResponse = await fetch(
      `https://graph.facebook.com/v19.0/${instaAcc.instagramBusinessId}/media`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          media_type: "STORIES",
          image_url: imageurl,

          access_token: instaAcc.pageAccessToken,
        }),
      },
    );

    const createContainerData = await createContainerResponse.json();

    if (!createContainerResponse.ok) {
      // DELETE IMAGE
      await cloudinary.uploader.destroy(public_id);

      return res.status(400).json({
        success: false,
        step: "CREATE_CONTAINER_FAILED",
        error: createContainerData,
      });
    }

    const publishResponse = await fetch(
      `https://graph.facebook.com/v19.0/${instaAcc.instagramBusinessId}/media_publish`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          creation_id: createContainerData.id,
          access_token: instaAcc.pageAccessToken,
        }),
      },
    );

    const publishData = await publishResponse.json();

    // DELETE IMAGE AFTER POST
    await cloudinary.uploader.destroy(public_id);

    if (!publishResponse.ok) {
      return res.status(400).json({
        success: false,
        error: publishData,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Instagram Story published successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const Create_Story_Post_Video = async (
  req: AuthReq,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accountId } = req.body;

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: "accountId is required",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video is required",
      });
    }

    const instaAcc =
      await InstaUser.findById(accountId).select("+pageAccessToken");

    if (!instaAcc) {
      return res.status(404).json({
        success: false,
        message: "Instagram account not found",
      });
    }

    if (!instaAcc.instagramBusinessId) {
      return res.status(400).json({
        success: false,
        message: "Instagram Business Account not connected",
      });
    }

    const cloudinaryResponse = await uploadVideoToCloudinary(req.file.buffer);

    const video_url: string = cloudinaryResponse.secure_url;
    const public_id: string = cloudinaryResponse.public_id;
    /*
      CREATE MEDIA CONTAINER
    */

    const createContainerResponse = await fetch(
      `https://graph.facebook.com/v19.0/${instaAcc.instagramBusinessId}/media`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          media_type: "STORIES",
          video_url,

          access_token: instaAcc.pageAccessToken,
        }),
      },
    );

    const createContainerData = await createContainerResponse.json();

    if (!createContainerResponse.ok) {
      await cloudinary.uploader.destroy(public_id);
      return res.status(400).json({
        success: false,
        step: "CREATE_CONTAINER_FAILED",

        error: createContainerData,
      });
    }

    const creationId = createContainerData.id;

    let status = "IN_PROGRESS";

    let retryCount = 0;

    /*
      MAX 20 RETRIES
    */

    while (status === "IN_PROGRESS" && retryCount < 20) {
      /*
        WAIT 5 SECONDS
      */

      await new Promise((resolve) => setTimeout(resolve, 5000));

      /*
        CHECK STATUS
      */

      const statusResponse = await fetch(
        `https://graph.facebook.com/v19.0/${creationId}?fields=status_code&access_token=${instaAcc.pageAccessToken}`,
      );

      const statusData = await statusResponse.json();

      status = statusData.status_code;

      /*
        VIDEO FAILED
      */
      await cloudinary.uploader.destroy(public_id);
      if (status === "ERROR") {
        return res.status(400).json({
          success: false,

          step: "VIDEO_PROCESSING_FAILED",

          statusData,
        });
      }

      retryCount++;
    }

    /*
      VIDEO NOT READY
    */

    if (status !== "FINISHED") {
      return res.status(400).json({
        success: false,

        message: "Video processing timeout",

        status,
      });
    }

    /*
      PUBLISH VIDEO
    */

    const publishResponse = await fetch(
      `https://graph.facebook.com/v19.0/${instaAcc.instagramBusinessId}/media_publish`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          creation_id: creationId,

          access_token: instaAcc.pageAccessToken,
        }),
      },
    );

    const publishData = await publishResponse.json();

    /*
      HANDLE PUBLISH ERROR
    */

    if (!publishResponse.ok) {
      return res.status(400).json({
        success: false,

        step: "PUBLISH_FAILED",

        error: publishData,
      });
    }

    /*
      SUCCESS
    */

    return res.status(200).json({
      success: true,

      message: "Video published successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const CreateCarouselPost = async (
  req: AuthReq,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { caption, accountId } = req.body;


    const files = req?.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Media files are required",
      });
    }

    if (files.length > 10) {
      return res.status(400).json({
        success: false,
        message: "Instagram allows max 10 carousel items",
      });
    }

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: "accountId is required",
      });
    }

    const instaAcc =
      await InstaUser.findById(accountId).select("+pageAccessToken");

    if (!instaAcc) {
      return res.status(404).json({
        success: false,
        message: "Instagram account not found",
      });
    }
   

 const childrenIds: string[] = [];

for  (const file of files) {
const isImage = file.mimetype.startsWith("image")
const isVideo = file.mimetype.startsWith("video")
 
   if (!isImage && !isVideo) {
        continue;
      }
       
}












    return res.status(200).json({
      success: true,

      message: "Carousel post published successfully",


    });
  } catch (error) {
    next(error);
  }
};

export const GetSinglePost = async (
  req: AuthReq,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accountId, mediaId } = req.query;

    if (!accountId || !mediaId) {
      return res.status(400).json({
        success: false,
        message: "accountId and mediaId are required",
      });
    }

    const instaAcc = await InstaUser.findById(accountId)
      .select("+pageAccessToken");

    if (!instaAcc) {
      return res.status(404).json({
        success: false,
        message: "Instagram account not found",
      });
    }

    const token = instaAcc.pageAccessToken;

    // Get Post Details
    const postResponse = await fetch(
      `https://graph.facebook.com/v23.0/${mediaId}?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username,comments_count,like_count,children{id,media_type,media_url,thumbnail_url}&access_token=${token}`
    );

    const post = await postResponse.json();

    // Get Comments
    const commentsResponse = await fetch(
      `https://graph.facebook.com/v23.0/${mediaId}/comments?fields=id,text,username,timestamp,like_count&access_token=${token}`
    );

    const commentsData = await commentsResponse.json();

    // Get Replies For Every Comment
    const commentsWithReplies = await Promise.all(
      (commentsData.data || []).map(async (comment: any) => {
        const repliesResponse = await fetch(
          `https://graph.facebook.com/v23.0/${comment.id}/replies?fields=id,text,username,timestamp,like_count&access_token=${token}`
        );

        const repliesData = await repliesResponse.json();

        return {
          ...comment,
          replies: repliesData.data || [],
        };
      })
    );

    return res.status(200).json({
      success: true,
      post: {
        ...post,
        comments: commentsWithReplies,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const ReplytoComment= async( req: AuthReq,res: Response,next: NextFunction)=>{
    try {
      
const {accountId, commentId,message }=req.body 

  if (!accountId) {
      return res.status(400).json({
        success: false,
        message: "accountId is required",
      });
    }
 const instaAcc= await InstaUser.findById(accountId).select("+pageAccessToken");

    if (!instaAcc) {
      return res.status(404).json({
        success: false,
        message: "Instagram account not found",
      });
    }

  const response = await fetch(
      `https://graph.facebook.com/v23.0/${commentId}/replies?message=${encodeURIComponent(
        message
      )}&access_token=${instaAcc.pageAccessToken}`,
      {
        method: "POST",
      }
    );
    const commentREs = await response.json();
    
   
   
   return res.status(200).json({
      success: true,
      post: commentREs,
    });


    } catch (error) {
      next(error)
    }
  }




export const DeleteAccount = async (
  req: AuthReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const accId = req.params.id;
    const user = req.user;

    const instauser = await InstaUser.findById(accId);

    if (!instauser) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // if (instauser.createdBy.toString() !== user._id.toString()) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Unauthorized",
    //   });
    // }

    await instauser.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};



