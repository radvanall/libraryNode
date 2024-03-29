const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../model/book");
const getAllBooksController = async (req, res) => {
  try {
    const data = await getAllBooks();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
const getBookByIdController = async (req, res) => {
  try {
    const data = await getBookById(req.params.id);
    return res.json(data);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
const createBookController = async (req, res) => {
  const values = [
    req.body.title,
    req.body.desc,
    req.body.cover,
    req.body.author,
  ];
  try {
    await createBook(values);
    return res.status(201).json("The book has been created");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err.message);
  }
};
const updateBookController = async (req, res) => {
  const values = [
    req.body.title,
    req.body.desc,
    req.body.cover,
    req.body.author,
    req.params.id,
  ];
  try {
    await updateBook(values);
    return res.status(201).json("The book has been modified successfully");
  } catch (err) {
    console.log("error=", err);
    return res.status(500).json(err.message);
  }
};
const deleteBookController = async (req, res) => {
  try {
    await deleteBook(req.params.id);
    return res.status(201).json("Book has been deleted successfully");
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
module.exports = {
  getAllBooksController,
  getBookByIdController,
  createBookController,
  updateBookController,
  deleteBookController,
};
