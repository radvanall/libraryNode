const fsPromises = require("fs").promises;

const deleteImage = async (img) => {
  console.log(img);
  if (img) {
    try {
      await fsPromises.access(img);
      console.log("File exists at", img);
      await fsPromises.unlink(img);
      console.log("File deleted successfully");
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("File not found:", img);
      } else {
        console.error("Error deleting file:", error);
      }
    }
  }
};

module.exports = deleteImage;
