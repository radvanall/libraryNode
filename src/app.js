const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const CustomError = require("./utils/CustomError");
const globalErrorHandler = require("./controllers/errorController");
const cors = require("cors");
const corsOptions = require("../config/corsOptions");

require("dotenv").config();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/books", require("./routes/bookRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/comments", require("./routes/commentRoutes"));
app.use("/genres", require("./routes/genreRoutes"));

app.all("*", (req, res, next) => {
  const err = new CustomError(
    `Cant find ${req.originalUrl} on the server !`,
    404
  );
  next(err);
});
app.use(globalErrorHandler);
module.exports = app;
