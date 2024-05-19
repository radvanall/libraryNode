const db = require("../../config/dbConfig");
const createPaginatedResult = require("../utils/createPaginatedResult");

const postComment = async (values) => {
  const q = `insert into comments(comment,book_id,user_id) values(?,?,?)`;
  await db.query(q, values);
};
const getCommentByBookId = async (bookId, totalComments, limit, page) => {
  const offset = (page - 1) * limit;
  const q = `select c.id,c.comment,c.user_id, u.login, u.avatar from comments c left join users u on c.user_id=u.id where book_id=? order by c.id DESC LIMIT ? OFFSET ?`;
  const [data] = await db.query(q, [bookId, limit, offset]);
  return createPaginatedResult(page, limit, offset, totalComments, data);
  // return data;
};
const getTotalNrOfCommentsByUserId = async (userId) => {
  const q =
    "select count(comment) as totalComments from comments  where user_id=?";
  const [data] = await db.query(q, userId);
  return data[0];
};
const getTotalNrOfCommentsByBookId = async (bookId) => {
  const q =
    "select count(comment) as totalComments from comments  where book_id=?";
  const [data] = await db.query(q, bookId);
  return data[0];
};
const getCommentByUserId = async (userId, totalComments, limit, page) => {
  const offset = (page - 1) * limit;
  const q =
    "select u.login,b.id as bookId,b.title,b.cover,c.comment, c.id as commentId from users u left join comments c on c.user_id=u.id left join books b on b.id=c.book_id where u.id=? LIMIT ? OFFSET ?";
  const [data] = await db.query(q, [userId, limit, offset]);
  return createPaginatedResult(page, limit, offset, totalComments, data);
  // return data;
};

const editComment = async (values) => {
  const q = "update comments set comment=? where id=?";
  await db.query(q, values);
};

const deleteComment = async (commentId) => {
  const q = "delete from comments where id=?";
  await db.query(q, commentId);
};
module.exports = {
  getCommentByBookId,
  getTotalNrOfCommentsByUserId,
  getTotalNrOfCommentsByBookId,
  getCommentByUserId,
  editComment,
  deleteComment,
  postComment,
};
