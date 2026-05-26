import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files allowed"));
  }
};

export const uploadVideo = multer({
  storage,
  limits: {
    fileSize: 1000 * 1024 * 1024, // 1GB
  },
  fileFilter,
});