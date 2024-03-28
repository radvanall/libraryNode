const {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  modifyUser,
} = require("../model/user");
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
  const values = [req.body.login, req.body.pass];
  try {
    await createUser(values);
    return res.json("The user has been created");
  } catch (err) {
    if (err.name === "taken") return res.status(409).json(err.message);
    if (err.hasOwnProperty("errno"))
      return res.status(500).json("Error on the server");
    return res.status(500).json(err.message);
  }
};
const deleteUserController = async (req, res) => {
  try {
    await deleteUser(req.params.id);
    return res.status(201).json("The user has been deleted successfully");
  } catch (err) {
    if (err.hasOwnProperty("errno"))
      return res.status(500).json("Error on the server");
    return res.status(500).json(err.message);
  }
};
const updateUserController = async (req, res) => {
  const values = [req.body.login, req.body.pass, req.params.id];
  try {
    await modifyUser(values);
    return res.status(201).json("The user has been modified");
  } catch (err) {
    if (err.name === "taken") return res.status(409).json(err.message);
    if (err.hasOwnProperty("errno"))
      return res.status(500).json("Error on the server");
    return res.status(500).json(err.message);
  }
};
module.exports = {
  getUsersController,
  getUserByIdController,
  createUserController,
  deleteUserController,
  updateUserController,
};
