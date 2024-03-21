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
app.get("/books/:id", (req, res) => {
  const q = "SELECT * FROM books where id=?";
  const bookId = req.params.id;

  db.query(q, [bookId], (err, data) => {
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
app.get("/users", (req, res) => {
  const q = "SELECT * FROM users";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.get("/users/:id", (req, res) => {
  const q = "SELECT * FROM users where id=?";
  const userId = req.params.id;

  db.query(q, [userId], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.post("/users", (req, res) => {
  const q = "insert into users(`login`,`pass`) values(?)";
  const values = [req.body.login, req.body.pass];
  const q2 = "SELECT * FROM users where login=?";
  db.query(q2, [req.body.login], (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0) {
      return res.json("This login is already taken.");
    } else {
      db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json("The user has been created");
      });
    }
  });
});
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const q = "delete from users  where id=?";
  db.query(q, [userId], (err, data) => {
    if (err) return res.json(err);
    return res.json("The user has been deleted successfully");
  });
});

app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const q = "update users set `login`=?, `pass`=? where id=?";
  const values = [req.body.login, req.body.pass];
  db.query(q, [...values, userId], (err, data) => {
    if (err) return res.json(err);
    return res.json("User has been updated successfully");
  });
});

app.listen(3500, () => {
  console.log("Connected to backend");
});
