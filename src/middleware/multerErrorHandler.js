const multer = require("multer");
const multerErrorHandler = function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    // handle file size error
    if (err.code === "LIMIT_FILE_SIZE")
      return res.status(400).send({ error: err.message });
    // handle unexpected file error
    if (err.code === "LIMIT_UNEXPECTED_FILE")
      return res.status(400).send({ error: err.message });
    // handle unexpected field key error
    if (err.code === "LIMIT_FIELD_KEY")
      return res.status(400).send({ error: err.message });
  }
  next(err);
  // res.status(400).end();
};
module.exports = multerErrorHandler;
