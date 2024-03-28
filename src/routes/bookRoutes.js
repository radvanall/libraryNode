const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
router
  .route("/")
  .get(bookController.getAllBooksController)
  .post(bookController.createBookController);
router
  .route("/:id")
  .get(bookController.getBookByIdController)
  .put(bookController.updateBookController)
  .delete(bookController.deleteBookController);
module.exports = router;
