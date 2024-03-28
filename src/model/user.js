const db = require("../../config/dbConfig");
const getAllUsers = async () => {
  const q = "SELECT * FROM users";
  const [data] = await db.query(q);
  return data;
};
const getUserById = async (userId) => {
  const q = "SELECT * FROM users where id=?";
  const [data] = await db.query(q, [userId]);
  return data[0];
};
const createUser = async (values) => {
  const q = "insert into users(`login`,`pass`) values(?)";
  const q2 = "SELECT * FROM users where login=?";
  const [data] = await db.query(q2, values[0]);
  if (data.length > 0) {
    let error = new Error("Login is already taken");
    error.name = "taken";
    throw error;
  }
  await db.query(q, [values]);
};
const deleteUser = async (userId) => {
  const q = "delete from users  where id=?";
  await db.query(q, [userId]);
};
const modifyUser = async (values) => {
  const q2 = "SELECT * FROM users where login=?";
  const q = "update users set `login`=?, `pass`=? where id=?";
  const [data] = await db.query(q2, values[0]);
  if (data.length > 0) {
    let error = new Error("Login is already taken");
    error.name = "taken";
    throw error;
  }
  await db.query(q, values);
};
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  modifyUser,
};
