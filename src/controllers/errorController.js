module.exports = (error, req, res, next) => {
  // console.log("error");
  // console.log(error);
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
};
