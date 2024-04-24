const db = require("../../config/dbConfig");
const createPaginatedResult = require("../utils/createPaginatedResult");
const getCommentByBookId = async (bookId, totalComments, limit, page) => {
  const offset = (page - 1) * limit;
  const q =
    "select c.id,c.comment,c.user_id, u.login, u.avatar from comments c inner join users u on c.user_id=u.id where book_id=? LIMIT ? OFFSET ?";
  const [data] = await db.query(q, [bookId, limit, offset]);
  return createPaginatedResult(page, limit, offset, totalComments, data);
  // return data;
};

module.exports = { getCommentByBookId };
