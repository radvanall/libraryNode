const express = require("express");
const app = express();

app.use(express.json());

app.use("/books", require("./routes/bookRoutes"));
app.use("/users", require("./routes/userRoutes"));

app.all("*", (req, res) => {
  return res.status(404).json({ error: "404 Not Found" });
});
module.exports = app;
