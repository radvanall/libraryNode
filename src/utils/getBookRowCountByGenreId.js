const db = require("../../config/dbConfig");
const getBookRowCountByGenreId = async (genreId) => {
  let q = `SELECT COUNT(*) as totalCount FROM ( SELECT DISTINCT b.id FROM books b 
    LEFT JOIN books_genres bg ON b.id = bg.book_id 
    WHERE bg.genre_id=?) as t `;
  const [res] = await db.query(q, genreId);
  console.log(res);
  return res[0].totalCount;
};
module.exports = getBookRowCountByGenreId;
