const multer = require("multer");

const multipartMulter = (folder) => {
  const storage = multer.memoryStorage();
  // const storage = multer.diskStorage({
  //   destination(req, res, cb) {
  //     cb(null, folder);
  //   },
  //   filename(req, file, cb) {
  //     cb(
  //       null,
  //       new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
  //     );
  //   },
  // });

  const types = ["image/png", "image/jpeg", "image/jpg"];
  const maxSize = 10 * 1024 * 1024;

  const fileFilter = (req, file, cb) => {
    if (types.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  });
};
module.exports = multipartMulter;
