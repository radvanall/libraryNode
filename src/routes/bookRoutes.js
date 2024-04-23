const express = require("express");
const router = express.Router();
const multerErrorHandler = require("../middleware/multerErrorHandler");
const multipartMulter = require("../middleware/multipartMulter");
const bookController = require("../controllers/bookController");
router
  .route("/")
  .get(bookController.getAllBooksController)
  .post(
    multipartMulter("images/books/").single("cover"),
    bookController.createBookController,
    multerErrorHandler
  );
router
  .route("/change-cover/:id")
  .put(
    multipartMulter("images/books/").single("cover"),
    bookController.changeCoverController,
    multerErrorHandler
  );
router
  .route("/:id")
  .get(bookController.getBookByIdController)
  .put(
    // multipartMulter("images/books/").single("cover"),
    bookController.updateBookController
    // multerErrorHandler
  )
  .delete(bookController.deleteBookController);
module.exports = router;
