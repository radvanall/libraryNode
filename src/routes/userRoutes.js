const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
router
  .route("/")
  .get(userController.getUsersController)
  .post(userController.createUserController);
router
  .route("/:id")
  .get(userController.getUserByIdController)
  .put(userController.updateUserController)
  .delete(userController.deleteUserController);
module.exports = router;
