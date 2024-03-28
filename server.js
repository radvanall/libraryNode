// const express = require("express");
// const app = express();

// app.use(express.json());

// app.use("/books", require("./routes/bookRoutes"));
// app.use("/users", require("./routes/userRoutes"));

// app.listen(3500, () => {
//   console.log("Connected to backend");
// });
const app = require("./src/app");

app.listen(3500, () => {
  console.log("Connected to backend");
});
