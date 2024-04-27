const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.route("/book").get(commentController.getCommentByBookIdController);
router.route("/user").get(commentController.getCommentByUserIdController);
router
  .route("/user/:id")
  .get(commentController.getNrOfCommentsByUserIdController);

router
  .route("/:id")
  .put(commentController.editCommentController)
  .delete(commentController.deleteCommentController);

module.exports = router;
