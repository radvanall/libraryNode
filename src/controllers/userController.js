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
const getUsersController = async (req, res) => {
  try {
    const data = await getAllUsers();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
const getUserByIdController = async (req, res) => {
  try {
    const data = await getUserById(req.params.id);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
const createUserController = async (req, res) => {
  if (!validateCreate(req))
    return res.status(403).json("All fields are required");
  const hashedPwd = await bcrypt.hash(req.body.pass, 10);
  let filePath = req?.file
    ? getFilePath(req.file.originalname, FILE_PATH)
    : null;
  const values = [req.body.login, hashedPwd, filePath];
  try {
    await createUser(values);
    if (req?.file) fs.writeFileSync(filePath, req.file.buffer);
    return res.json("The user has been created");
  } catch (err) {
    if (err.name === "taken") return res.status(409).json(err.message);
    return res.status(500).json(err.message);
  }
};
const deleteUserController = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    await deleteUser(req.params.id);
    deleteImage(user.avatar);
    return res.status(201).json("The user has been deleted successfully");
  } catch (err) {
    if (err.hasOwnProperty("errno"))
      return res.status(500).json("Error on the server");
    return res.status(500).json(err.message);
  }
};
const updateUserController = async (req, res) => {
  if (!validateUpdate(req))
    return res.status(403).json("All fields are required");
  const hashedPwd = await bcrypt.hash(req.body.pass, 10);
  // let filePath = req?.file
  //   ? getFilePath(req.file.originalname, FILE_PATH)
  //   : null;
  const values = [req.body.login, hashedPwd, req.params.id];
  try {
    await modifyUser(values);
    // if (req?.file) fs.writeFileSync(filePath, req.file.buffer);
    return res.status(201).json("The user has been modified");
  } catch (err) {
    if (err.name === "taken") return res.status(409).json(err.message);
    if (err.hasOwnProperty("errno"))
      return res.status(500).json("Error on the server");
    return res.status(500).json(err.message);
  }
};
const changeAvatarController = async (req, res) => {
  console.log(req.file);
  console.log(req.params.id);
  try {
    const user = await getUserById(req.params.id);

    // if (user.avatar !== null) {
    //   if (fs.existsSync(user.avatar)) {
    //     console.log("File exists at", user.avatar);
    //     fs.unlinkSync(user.avatar);
    //   }
    // }
    let filePath = req?.file
      ? getFilePath(req.file.originalname, FILE_PATH)
      : null;
    const values = [filePath, req.params.id];
    console.log("values i=", values);
    await changeAvatar(values);
    deleteImage(user.avatar);
    if (req?.file) fs.writeFileSync(filePath, req.file.buffer);

    console.log(user.avatar);
    console.log(user.avatar === null);
    return res.status(202).json({ message: "The avatar has been changed." });
  } catch (err) {
    return res.status(400).json({ err: err.message });
  }
};
const authController = async (req, res) => {
  if (!validateCreate(req))
    return res.status(403).json("All fields are required");
  const values = [req.body.login, req.body.pass];
  try {
    const result = await getUserByLogin(values);
    console.log(result.role);
    if (!result) return res.status(403).json("Password or nickname are wrong.");
    const match = await bcrypt.compare(req.body.pass, result.pass);
    if (!match) return res.status(403).json("Password or nickname are wrong.");
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
    return res.status(200).json({ accessToken });
  } catch (err) {
    console.log(err);
    return res.status(409).json("Something went wrong.");
  }
};

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log("cookies=", cookies);
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const foundUser = await getUserByToken(refreshToken);
  console.log("foundUser=", foundUser);
  if (!foundUser) return res.sendStatus(403);
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (decoded.username !== foundUser.login) return res.sendStatus(403);
    console.log(decoded);
    const userData = { username: decoded.username, roles: foundUser.role };
    const accessToken = createToken(
      userData,
      process.env.ACCESS_TOKEN_SECRET,
      "1m"
    );
    res.json({ accessToken });
  } catch (err) {
    if (err) return res.sendStatus(403);
  }
};
const handleLogout = async (req, res) => {
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
};
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
};
