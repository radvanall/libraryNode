const getFilePath = (originalname, FILE_PATH) => {
  let filePath = null;
  if (originalname?.length > 15) {
    originalname = originalname.slice(-14);
  }
  if (originalname) {
    filePath =
      FILE_PATH +
      "/" +
      new Date().toISOString().replace(/:/g, "-") +
      "-" +
      originalname;
  }
  return filePath;
};
module.exports = getFilePath;
