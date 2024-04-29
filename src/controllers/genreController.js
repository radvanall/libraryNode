const {
  getAllGenres,
  getAllGenresAndNrOfBooks,
  createGenre,
  updateGenre,
  deleteGenre,
} = require("../model/genre");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");

const getAllGenresController = asyncErrorHandler(async (req, res, next) => {
  const data = await getAllGenres();
  return res.status(200).json(data);
});

const getAllGenresAndNrOfBooksController = asyncErrorHandler(
  async (req, res, next) => {
    const data = await getAllGenresAndNrOfBooks();
    return res.status(200).json(data);
  }
);

const createGenreController = asyncErrorHandler(async (req, res, next) => {
  if (!req?.body?.genre) {
    const error = new CustomError("No genre send", 404);
    return next(error);
  }
  await createGenre(req.body.genre);
  return res.status(202).json({ message: "The genre has been created" });
});

const updateGenreController = asyncErrorHandler(async (req, res, next) => {
  if (!req?.body?.genre || !req?.params?.id) {
    const error = new CustomError("The input is wrong", 404);
    return next(error);
  }
  const values = [req.body.genre, req.params.id];
  await updateGenre(values);
  return res.status(202).json({ message: "The genre has been updated" });
});

const deleteGenreController = asyncErrorHandler(async (req, res, next) => {
  if (!req?.params?.id) {
    const error = new CustomError("The input is wrong", 404);
    return next(error);
  }
  await deleteGenre(req.params.id);
  return res.status(202).json({ message: "The genre has been removed" });
});
module.exports = {
  getAllGenresController,
  getAllGenresAndNrOfBooksController,
  updateGenreController,
  createGenreController,
  deleteGenreController,
};
