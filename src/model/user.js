const db = require("../../config/dbConfig");
const getAllUsers = async () => {
  const q = "SELECT id,login,pass FROM users";
  const [data] = await db.query(q);
  return data;
};
const getUserById = async (userId) => {
  console.log("getid=", userId);
  const q = "SELECT id,login,pass,avatar FROM users where id=?";
  const [data] = await db.query(q, [userId]);
  return data[0];
};
const createUser = async (values) => {
  const q = "insert into users(`login`,`pass`,`avatar`) values(?)";
  const q2 = "SELECT * FROM users where login=?";
  const [data] = await db.query(q2, values[0]);
  if (data.length > 0) {
    let error = new Error("Login is already taken");
    error.name = "taken";
    throw error;
  }
  const [res] = await db.query(q, [values]);
  const insertId = res.insertId;
  const q3 = "insert into users_roles(`users_id`,`roles_id`) values(?,?)";
  await db.query(q3, [insertId, 2]);
  console.log(insertId);
};
const deleteUser = async (userId) => {
  const q = "delete from users  where id=?";
  const q2 = "delete from users_roles where users_id=?";
  const q3 = "update comments set user_id=null where user_id=?";
  await db.query(q3, [userId]);
  await db.query(q2, [userId]);
  await db.query(q, [userId]);
};
const modifyUser = async (values) => {
  const q2 = "SELECT * FROM users where login=?";
  const q = "update users set `login`=?, `pass`=? where id=?";
  const [data] = await db.query(q2, values[0]);
  if (data.length > 0 && data[0].id !== parseInt(values[2])) {
    let error = new Error("Login is already taken");
    error.name = "taken";
    throw error;
  }
  await db.query(q, values);
};
const changeAvatar = async (values) => {
  console.log("values=", values);
  const q = "update users set `avatar`=? where id=?";
  await db.query(q, values);
};
const getUserByLogin = async (values) => {
  // const q = "select * from users where login=?";
  const q =
    "select u.id,u.login,u.pass,u.token,r.role from users u left join users_roles ur on u.id=ur.users_id left join roles r on r.id=ur.roles_id where u.login=?";
  const [data] = await db.query(q, values[0]);
  return data[0];
};
const setToken = async (values) => {
  const q = "update users set `token`=? where `id`=?";
  await db.query(q, values);
};
const getUserByToken = async (token) => {
  // const q = "select * from users where token=?";
  const q =
    "select u.id,u.login,u.pass,u.token,r.role from users u left join users_roles ur on u.id=ur.users_id left join roles r on r.id=ur.roles_id where u.token=?";
  const [data] = await db.query(q, [token]);
  return data[0];
};
module.exports = {
  getUserByLogin,
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  modifyUser,
  setToken,
  getUserByToken,
  changeAvatar,
};
