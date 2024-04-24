const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.route("/book").get(commentController.getCommentByBookIdController);

module.exports = router;
