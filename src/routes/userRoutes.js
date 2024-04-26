const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");
const multerErrorHandler = require("../middleware/multerErrorHandler");
const multipartMulter = require("../middleware/multipartMulter");
router
  .route("/")
  .get(
    // verifyJWT,
    // verifyRoles(ROLES_LIST.Admin),
    userController.getUsersController
  )
  .post(
    multipartMulter("images/users/").single("avatar"),
    userController.createUserController,
    multerErrorHandler
  );
router
  .route("/change-avatar/:id")
  .put(
    multipartMulter("images/users/").single("avatar"),
    userController.changeAvatarController,
    multerErrorHandler
  );
router.route("/change-role").put(userController.changeRoleController);
router.route("/auth").get(userController.authController);
router.route("/refresh").get(userController.handleRefreshToken);
router.route("/logout").get(userController.handleLogout);
router
  .route("/:id")
  .get(userController.getUserByIdController)
  .put(userController.updateUserController)
  .delete(userController.deleteUserController);

module.exports = router;
