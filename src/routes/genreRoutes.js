const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genreController");

router
  .route("/")
  .get(genreController.getAllGenresController)
  .post(genreController.createGenreController);
router
  .route("/book-count")
  .get(genreController.getAllGenresAndNrOfBooksController);
router
  .route("/:id")
  .put(genreController.updateGenreController)
  .delete(genreController.deleteGenreController);

module.exports = router;
