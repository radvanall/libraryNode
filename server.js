const db = require("./config/dbConfig");
const q = "SELECT * FROM books";
db.query(q, (err, data) => {
  if (err) console.log(err);
  console.log(data);
});
