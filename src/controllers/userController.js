const {
  getUserByLogin,
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  modifyUser,
  setToken,
  changeAvatar,
  getUserByToken,
  changeRole,
} = require("../model/user");
const deleteImage = require("../utils/deleteImage");
const validateUpdate = require("../utils/validateUpdateUser");
const validateCreate = require("../utils/validateCreateUser");
const fs = require("fs");
const path = require("path");
const createToken = require("../utils/createToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const FILE_PATH = path.join(__dirname, "..", "..", "images", "users");
const getFilePath = require("../utils/getFilePath");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");

const getUsersController = asyncErrorHandler(async (req, res, next) => {
  const data = await getAllUsers();
  return res.status(200).json(data);
});

const getUserByIdController = asyncErrorHandler(async (req, res, next) => {
  const data = await getUserById(req.params.id);
  return res.status(200).json(data);
});

const createUserController = asyncErrorHandler(async (req, res, next) => {
  if (!validateCreate(req)) {
    const error = new CustomError("All fields are required", 404);
    return next(error);
  }
  const hashedPwd = await bcrypt.hash(req.body.pass, 10);
  let filePath = req?.file
    ? getFilePath(req.file.originalname, FILE_PATH)
    : null;
  const values = [req.body.login, hashedPwd, filePath];
  await createUser(values);
  if (req?.file) fs.writeFileSync(filePath, req.file.buffer);
  return res.json("The user has been created");
});

const deleteUserController = asyncErrorHandler(async (req, res, next) => {
  const user = await getUserById(req.params.id);
  if (user.role === 5150) {
    const error = new CustomError("you can't delete this user", 401);
    return next(error);
  }
  await deleteUser(req.params.id);
  deleteImage(user.avatar);
  return res.status(201).json("The user has been deleted successfully");
});

const updateUserController = asyncErrorHandler(async (req, res, next) => {
  if (!validateUpdate(req)) {
    const error = new CustomError("All fields are required", 403);
    return next(error);
  }
  const hashedPwd = await bcrypt.hash(req.body.newPass, 10);
  const values = [req.body.login, hashedPwd, req.params.id];
  const user = await getUserById(req.params.id);
  if (!user) {
    const error = new CustomError("No such user", 403);
    return next(error);
  }
  const match = await bcrypt.compare(req.body.pass, user.pass);
  if (!match) {
    const error = new CustomError("Incorrect user or password.", 404);
    return next(error);
  }
  await modifyUser(values);
  return res.status(201).json("The user has been modified");
});

const changeAvatarController = asyncErrorHandler(async (req, res, next) => {
  const user = await getUserById(req.params.id);
  let filePath = req?.file
    ? getFilePath(req.file.originalname, FILE_PATH)
    : null;
  const values = [filePath, req.params.id];
  await changeAvatar(values);
  deleteImage(user.avatar);
  if (req?.file) fs.writeFileSync(filePath, req.file.buffer);
  return res.status(202).json({ message: "The avatar has been changed." });
});

const changeRoleController = asyncErrorHandler(async (req, res, next) => {
  if (!req?.body?.id || !req?.body?.roleId) {
    const error = new CustomError("Wrong input", 401);
    return next(error);
  }
  if (req.body.id === 1) {
    const error = new CustomError("you can't change  this user's role!", 401);
    return next(error);
  }
  const values = [req.body.id, req.body.roleId];
  await changeRole(values);
  return res.status(200).json({ message: "The role has been changed" });
});

const authController = asyncErrorHandler(async (req, res, next) => {
  if (!validateCreate(req)) {
    const error = new CustomError("All fields are required", 403);
    return next(error);
  }
  const values = [req.body.login, req.body.pass];

  const result = await getUserByLogin(values);
  console.log(result.role);
  if (!result) {
    const error = new CustomError("Password or nickname are wrong.", 403);
    return next(error);
  }
  const match = await bcrypt.compare(req.body.pass, result.pass);
  if (!match) {
    const error = new CustomError("Password or nickname are wrong.", 403);
    return next(error);
  }
  const userData = { username: result.login };
  const refreshToken = createToken(
    userData,
    process.env.REFRESH_TOKEN_SECRET,
    "1d"
  );
  userData.roles = result.role;
  const accessToken = createToken(
    userData,
    process.env.ACCESS_TOKEN_SECRET,
    "1m"
  );
  await setToken([refreshToken, result.id]);
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  const { pass, token, ...user } = result;

  return res.status(200).json({ accessToken, user });
});

const handleRefreshToken = asyncErrorHandler(async (req, res, next) => {
  const cookies = req.cookies;
  console.log("cookies=", cookies);
  if (!cookies?.jwt) {
    const error = new CustomError("Access denied", 401);
    return next(error);
  }
  const refreshToken = cookies.jwt;
  const foundUser = await getUserByToken(refreshToken);
  console.log("foundUser=", foundUser);
  if (!foundUser) {
    const error = new CustomError("Access denied", 403);
    return next(error);
  }
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  if (decoded.username !== foundUser.login) {
    const error = new CustomError("Access denied", 403);
    return next(error);
  }
  console.log(decoded);
  const userData = { username: decoded.username, roles: foundUser.role };
  const accessToken = createToken(
    userData,
    process.env.ACCESS_TOKEN_SECRET,
    "1m"
  );
  res.json({ accessToken });
});

const handleLogout = asyncErrorHandler(async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  const foundUser = await getUserByToken(refreshToken);
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }
  await setToken([null, foundUser.id]);
  res.clearCookie("jwt", { httpOnly: true });
  return res.sendStatus(204);
});

module.exports = {
  getUsersController,
  getUserByIdController,
  createUserController,
  deleteUserController,
  updateUserController,
  authController,
  changeAvatarController,
  handleRefreshToken,
  handleLogout,
  changeRoleController,
};
