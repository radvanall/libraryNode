const db = require("./config/dbConfig");
const express = require("express");
const app = express();
app.use(express.json());
app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.post("/books", (req, res) => {
  const q =
    "insert into books(`title`,`description`,`cover`,`author`) values(?)";
  const values = [
    req.body.title,
    req.body.desc,
    req.body.cover,
    req.body.author,
  ];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("The book has been created");
  });
});
app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q =
    "update books set `title`=?, `description`=?, `cover`=?, `author`=? where id=?";
  const values = [
    req.body.title,
    req.body.desc,
    req.body.cover,
    req.body.author,
  ];
  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Book has been updated successfully");
  });
});
app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "delete from books  where id=?";
  db.query(q, [bookId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Book has been deleted successfully");
  });
});
app.listen(3500, () => {
  console.log("Connected to backend");
});
