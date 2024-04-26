const {
  getAllGenres,
  getAllGenresAndNrOfBooks,
  createGenre,
  updateGenre,
  deleteGenre,
} = require("../model/genre");

const getAllGenresController = async (req, res) => {
  try {
    const data = await getAllGenres();
    return res.status(200).json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error on the server", err: err.message });
  }
};
const getAllGenresAndNrOfBooksController = async (req, res) => {
  try {
    const data = await getAllGenresAndNrOfBooks();
    return res.status(200).json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error on the server", err: err.message });
  }
};
const createGenreController = async (req, res) => {
  if (!req?.body?.genre)
    return res.status(404).json({ message: "No genre send" });
  try {
    await createGenre(req.body.genre);
    return res.status(202).json({ message: "The genre has been created" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error on the server", err: err.message });
  }
};
const updateGenreController = async (req, res) => {
  if (!req?.body?.genre || !req?.params?.id)
    return res.status(404).json({ message: "The input is wrong" });
  const values = [req.body.genre, req.params.id];
  try {
    await updateGenre(values);
    return res.status(202).json({ message: "The genre has been updated" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error on the server", err: err.message });
  }
};
const deleteGenreController = async (req, res) => {
  if (!req?.params?.id)
    return res.status(404).json({ message: "The input is wrong" });

  try {
    await deleteGenre(req.params.id);
    return res.status(202).json({ message: "The genre has been removed" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error on the server", err: err.message });
  }
};
module.exports = {
  getAllGenresController,
  getAllGenresAndNrOfBooksController,
  updateGenreController,
  createGenreController,
  deleteGenreController,
};
