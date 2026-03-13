import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    return cb(new Error("Only JPG, JPEG, and PNG files are allowed"));
  }
  cb(null, true);
};

const upload = multer({ storage: storage });

export default upload;
