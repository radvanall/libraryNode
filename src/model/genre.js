const db = require("../../config/dbConfig");

const getAllGenres = async () => {
  const q = "select * from genres";
  const [res] = await db.query(q);
  return res;
};
const getAllGenresAndNrOfBooks = async () => {
  const q =
    "SELECT g.id, g.genre, COALESCE(count(bg.book_id), 0) AS nrOfBooks FROM genres g LEFT JOIN books_genres bg ON g.id= bg.genre_id GROUP BY g.id, g.genre;";
  const [res] = await db.query(q);
  return res;
};
const createGenre = async (genre) => {
  const q = "insert into genres(genre) value(?)";
  await db.query(q, genre);
};
const updateGenre = async (values) => {
  const q = "update genres set genre=? where id=?";
  await db.query(q, values);
};
const deleteGenre = async (genreId) => {
  const q = "delete from genres where id=?";
  const q2 = "delete from books_genres where genre_id=?";
  await db.query(q2, genreId);
  await db.query(q, genreId);
};
module.exports = {
  getAllGenres,
  getAllGenresAndNrOfBooks,
  createGenre,
  updateGenre,
  deleteGenre,
};
