const mysql = require("mysql2/promise");
const db = mysql.createPool({
  host: "localhost",
  user: "bestuser",
  password: "bestuser",
  database: "library",
});

module.exports = db;
