const db = require("../../config/dbConfig");
const getRowCount = require("../utils/getRowCount");
const getBookRowCountByGenreId = require("../utils/getBookRowCountByGenreId");
const getBooksRowCount = require("../utils/getBooksRowCount");
const createPaginatedResult = require("../utils/createPaginatedResult");
const { setGenres, setGenre } = require("../utils/setGenres");
const getAllBooks = async (page, limit, ignoredGenres, searchWord) => {
  let q = `SELECT * FROM ( SELECT b.id, b.title, b.author,b.cover,
    GROUP_CONCAT(g.genre,'|',g.id) AS genres FROM books b 
    LEFT JOIN books_genres bg ON b.id = bg.book_id LEFT JOIN genres g ON bg.genre_id = g.id  WHERE b.title like ? GROUP BY b.id) AS sq
    HAVING id in (SELECT b.id FROM books b  left join   books_genres bg on b.id=bg.book_id `;
  console.log("isArray=", Array.isArray(ignoredGenres));
  if (Array.isArray(ignoredGenres) && ignoredGenres.length > 0) {
    console.log("a");
    const placeholders = ignoredGenres.map(() => "?").join(", ");
    q += " WHERE bg.genre_id NOT IN (" + placeholders + ") ";
    q += "OR bg.genre_id IS NULL";
  }
  q += ") LIMIT ? OFFSET ?";
  console.log(q);
  const searchPattern = `%${searchWord}%`;
  const offset = (page - 1) * limit;
  const [data] = await db.query(q, [
    searchPattern,
    ...ignoredGenres,
    limit,
    offset,
  ]);
  setGenres(data);
  const totalBooks = await getBooksRowCount(ignoredGenres, searchPattern);
  return createPaginatedResult(page, limit, offset, totalBooks, data);
};
const getBookById = async (bookId) => {
  const q = `SELECT b.id,b.title,b.description,b.cover,b.author, GROUP_CONCAT(g.genre,'|',g.id) AS genres FROM books b left JOIN books_genres bg on bg.book_id=b.id
  left join genres g on bg.genre_id=g.id 
  where b.id=? group by b.id`;
  const [data] = await db.query(q, [bookId]);
  setGenre(data[0]);
  return data[0];
};
const getAllBooksByGenreId = async (genreId, page, limit) => {
  const q = `SELECT * FROM ( SELECT b.id, b.title, b.author,b.cover,
    GROUP_CONCAT(g.genre,'|',g.id) AS genres FROM books b 
    LEFT JOIN books_genres bg ON b.id = bg.book_id LEFT JOIN genres g ON bg.genre_id = g.id GROUP BY b.id) AS sq
    HAVING id in (SELECT b.id FROM books b  left join   books_genres bg on b.id=bg.book_id  WHERE bg.genre_id IN (?))  LIMIT ? OFFSET ?`;
  const offset = (page - 1) * limit;
  const [data] = await db.query(q, [genreId, limit, offset]);
  console.log("data before  genreid=", data);
  setGenres(data);
  const totalBooks = await getBookRowCountByGenreId(genreId);
  return createPaginatedResult(page, limit, offset, totalBooks, data);
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
const changeGenres = async (values, bookId) => {
  const q = "select genre_id,id from books_genres where book_id=?";
  const [res] = await db.query(q, bookId);
  const toBeDeleted = [];
  res.forEach((value) => {
    if (!values.includes(value.genre_id)) toBeDeleted.push(value.id);
  });
  const currentGenres = res.map((item) => item.genre_id);
  const toBeAdded = [];
  values.forEach((genre) => {
    if (!currentGenres.includes(genre)) toBeAdded.push(genre);
  });
  if (toBeDeleted.length > 0) {
    const placeholders = toBeDeleted.map(() => "?").join(", ");
    const q2 = `delete from books_genres where id IN (${placeholders})`;
    await db.query(q2, toBeDeleted);
  }
  if (toBeAdded.length > 0) {
    const placeholders = toBeAdded
      .map((genre) => `(${bookId},${genre})`)
      .join(",");
    const q2 =
      `insert into books_genres(book_id,genre_id) values` + placeholders;
    await db.query(q2, toBeDeleted);
  }
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
  changeGenres,
  getAllBooksByGenreId,
};
