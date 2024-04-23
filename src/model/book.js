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
    "update books set `title`=?, `description`=?,  `author`=? where id=?";
  await db.query(q, values);
};
const changeCover = async (values) => {
  const q = "update books set `cover`=? where id=?";
  await db.query(q, values);
};
const deleteBook = async (bookId) => {
  const q = "delete from books  where id=?";
  const q2 = "update comments set book_id=null where book_id=?";
  const q3 = "delete from books_genres where book_id=?";
  await db.query(q3, [bookId]);
  await db.query(q2, [bookId]);
  await db.query(q, [bookId]);
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  changeCover,
};
