import multer from "multer";

const storage = multer.memoryStorage();

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const imageUpload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      const error = new Error(
        "Only JPG, PNG and WEBP images are allowed"
      );

      error.statusCode = 400;

      return cb(error, false);
    }

    cb(null, true);
  },
});

export const uploadImage = (
  folderName,
  fieldName = "image"
) => {
  const upload =
    imageUpload.single(fieldName);

  return (req, res, next) => {
    req.uploadFolder = folderName;

    upload(req, res, (error) => {
      if (error) {
        return next(error);
      }

      next();
    });
  };
};