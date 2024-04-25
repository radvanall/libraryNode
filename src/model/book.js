const db = require("../../config/dbConfig");
const getRowCount = require("../utils/getRowCount");
const createPaginatedResult = require("../utils/createPaginatedResult");
const setGeneres = require("../utils/setGenres");
const getAllBooks = async (page, limit) => {
  const q =
    "SELECT b.id, b.title, b.author,b.cover," +
    "GROUP_CONCAT(g.genre,'|',g.id) AS genres FROM books b " +
    "LEFT JOIN books_genres bg ON b.id = bg.book_id LEFT JOIN genres g ON bg.genre_id = g.id GROUP BY b.id  LIMIT ? OFFSET ?";

  const offset = (page - 1) * limit;
  const [data] = await db.query(q, [limit, offset]);
  setGeneres(data);
  const totalBooks = await getRowCount("books");
  return createPaginatedResult(page, limit, offset, totalBooks, data);
};
const getBookById = async (bookId) => {
  const q =
    "SELECT b.id,b.title,b.description,b.cover,b.author,count(b.id) as totalComments FROM books b left JOIN comments c on c.book_id=b.id where b.id=? group by b.id";
  const [data] = await db.query(q, [bookId]);
  return data[0];
};
const createBook = async (values, genres) => {
  const q =
    "insert into books(`title`,`description`,`cover`,`author`) values(?)";
  const [res] = await db.query(q, [values]);
  const insertId = res.insertId;
  let q2 = "insert into books_genres(book_id,genre_id) values";
  genres.forEach((genre) => {
    const pair = `(${insertId},${genre}),`;
    q2 += pair;
  });
  q2 = q2.slice(0, q2.length - 1);
  await db.query(q2);
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
