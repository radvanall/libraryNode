const db = require("../../config/dbConfig");
const getUsersRowCount = require("../utils/getUsersRowCount");
const createPaginatedResult = require("../utils/createPaginatedResult");

const getAllUsers = async (page, limit, role, searchWord) => {
  let q = `select u.id,u.login,u.avatar,r.role,count(c.comment) as nrOfComments from users u left join users_roles ur on u.id=ur.users_id left join 
  roles r on r.id=ur.roles_id left join comments c on c.user_id=u.id   `;

  const searchPattern = `%${searchWord}%`;
  const params = [];

  if (role) {
    q += `where `;
    q += ` r.role=? `;
    params.push(role);
  }
  if (searchWord) {
    if (role) {
      q += `and `;
    } else q += `where `;
    q += `u.login like ? `;
    params.push(searchPattern);
  }
  q += `  group by u.id,u.login,u.avatar,r.role LIMIT ? OFFSET ?`;
  const offset = (page - 1) * limit;
  console.log(q);
  const [data] = await db.query(q, [...params, limit, offset]);
  console.log("data=", data);
  const totalNumber = await getUsersRowCount(role, searchWord);
  return createPaginatedResult(page, limit, offset, totalNumber, data);
};
const getUserById = async (userId) => {
  console.log("getid=", userId);
  const q =
    "select u.id,u.login,u.avatar,u.pass,r.role,count(c.comment) as totalComments from users u left join users_roles ur on u.id=ur.users_id left join roles r on r.id=ur.roles_id left join comments c on c.user_id=u.id where u.id=? group by u.id,u.login,u.avatar,r.role";
  const [data] = await db.query(q, userId);
  return data[0];
};
const getUserRoleById = async (userId) => {
  const q =
    "select r.role from users_roles ur left join roles r on r.id=ur.roles_id where ur.users_id=?";

  const [data] = await db.query(q, [userId]);
  console.log(data[0].role == 2001);
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
const changeRole = async (values) => {
  const q = "delete from users_roles where users_id=?";
  await db.query(q, values[0]);
  const q2 = "insert into users_roles(`users_id`,`roles_id`) values(?,?)";
  await db.query(q2, values);
};
const changeAvatar = async (values) => {
  const q = "update users set `avatar`=? where id=?";
  await db.query(q, values);
};
const getUserByLogin = async (values) => {
  const q =
    "select u.id,u.login,u.pass,u.avatar,u.token,r.role from users u left join users_roles ur on u.id=ur.users_id left join roles r on r.id=ur.roles_id where u.login=?";
  const [data] = await db.query(q, values[0]);
  return data[0];
};
const setToken = async (values) => {
  const q = "update users set `token`=? where `id`=?";
  await db.query(q, values);
};
const getUserByToken = async (token) => {
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
  getUserRoleById,
  changeRole,
};
