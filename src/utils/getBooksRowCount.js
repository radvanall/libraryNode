const db = require("../../config/dbConfig");
const getBooksRowCount = async (ignoredGenres) => {
  let q = `SELECT COUNT(*) as totalCount FROM(
    SELECT DISTINCT b.id from  books b  left join books_genres bg on b.id=bg.book_id 
         HAVING b.id in (SELECT b.id FROM books b  left join books_genres bg on b.id=bg.book_id  `;
  if (Array.isArray(ignoredGenres) && ignoredGenres.length > 0) {
    console.log("a");
    const placeholders = ignoredGenres.map(() => "?").join(", ");
    q +=
      " where bg.genre_id not in (" + placeholders + ") OR bg.genre_id IS NULL";
  }
  q += ")) as t";
  const [res] = await db.query(q, ignoredGenres);
  console.log(res);
  return res[0].totalCount;
};
module.exports = getBooksRowCount;
