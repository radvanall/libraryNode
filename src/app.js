const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
app.use("/books", require("./routes/bookRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/comments", require("./routes/commentRoutes"));

app.all("*", (req, res) => {
  return res.status(404).json({ error: "404 Not Found" });
});
app.use((error, req, res, next) => {
  console.log("error");
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
});
module.exports = app;
