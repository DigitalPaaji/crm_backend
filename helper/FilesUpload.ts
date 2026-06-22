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
    const folder = file.mimetype.split("/")[0];

    
    cb(null, uploadDirs(folder));
  },

  filename: (req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const FileUpload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

export default FileUpload;