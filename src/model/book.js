const db = require("../../config/dbConfig");
const getAllBooks = async () => {
  const q = "SELECT * FROM books";
  const [data] = await db.query(q);
  return data;
};
const getBookById = async (bookId) => {
  const q = "SELECT * FROM books where id=?";
  const [data] = await db.query(q, [bookId]);
  return data[0];
};
const createBook = async (values) => {
  const q =
    "insert into books(`title`,`description`,`cover`,`author`) values(?)";
  await db.query(q, [values]);
};
const updateBook = async (values) => {
  const q =
    "update books set `title`=?, `description`=?, `cover`=?, `author`=? where id=?";
  await db.query(q, values);
};
const deleteBook = async (bookId) => {
  const q = "delete from books  where id=?";
  await db.query(q, [bookId]);
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
