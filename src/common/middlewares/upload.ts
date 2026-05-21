import multer from "multer";
import BadRequestError from "../errors/bad-request";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!file.mimetype.startsWith("image")) {
    return cb(new BadRequestError("Only image files are allowed"));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
});

export default upload;