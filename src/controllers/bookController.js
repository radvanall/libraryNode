const {
  getAllBooks,
  getBookById,
  createBook,
  changeCover,
  updateBook,
  deleteBook,
} = require("../model/book");
const deleteImage = require("../utils/deleteImage");
const getFilePath = require("../utils/getFilePath");
const validateGetAllBooks = require("../utils/validateGetAllBooks");
const fs = require("fs");
const path = require("path");
const FILE_PATH = path.join(__dirname, "..", "..", "images", "books");
const validateCreateBook = require("../utils/validateCreateBook");
const getAllBooksController = async (req, res) => {
  if (!validateGetAllBooks(req))
    return res.status(404).json({ message: "No such page." });
  try {
    const data = await getAllBooks(
      parseInt(req.query.page),
      parseInt(req.query.limit)
    );

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
  const valid = validateCreateBook(req);
  if (!valid)
    return res.status(401).json({ message: "All fields are required" });
  let filePath = req?.file
    ? getFilePath(req.file.originalname, FILE_PATH)
    : null;

  const values = [req.body.title, req.body.desc, filePath, req.body.author];
  try {
    await createBook(values);
    if (req?.file) fs.writeFileSync(filePath, req.file.buffer);
    return res.status(201).json("The book has been created");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err.message);
  }
};
const updateBookController = async (req, res) => {
  const valid = validateCreateBook(req);
  if (!valid)
    return res.status(401).json({ message: "All fields are required" });
  const values = [
    req.body.title,
    req.body.desc,
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
const changeCoverController = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);
    deleteImage(book.cover);
    let filePath = req?.file
      ? getFilePath(req.file.originalname, FILE_PATH)
      : null;
    const values = [filePath, req.params.id];
    console.log("values i=", values);
    await changeCover(values);
    if (req?.file) fs.writeFileSync(filePath, req.file.buffer);
    return res
      .status(200)
      .json({ message: "The book cover has been changed." });
  } catch (err) {
    return res.status(400).json({ err: err.message });
  }
};
const deleteBookController = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);
    await deleteBook(req.params.id);
    deleteImage(book.cover);
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
  changeCoverController,
};
