const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "bestuser",
  password: "bestuser",
  database: "library",
});
module.exports = db;
