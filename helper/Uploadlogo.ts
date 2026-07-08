import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirs = (folder: string) => {
  const uploadPath = path.join(process.cwd(), "uploads", folder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return uploadPath;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
   

    
    cb(null, uploadDirs("logo"));
  },

  filename: (req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const UploadLogo = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default UploadLogo;