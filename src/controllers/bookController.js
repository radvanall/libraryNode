const {
  getAllBooks,
  getBookById,
  createBook,
  changeCover,
  updateBook,
  deleteBook,
  changeGenres,
  getAllBooksByGenreId,
} = require("../model/book");

const deleteImage = require("../utils/deleteImage");
const getFilePath = require("../utils/getFilePath");
const validateGetAllBooks = require("../utils/validateGetAllBooks");
const getGenres = require("../utils/getGenres");
const fs = require("fs");
const path = require("path");
// const FILE_PATH = path.join(__dirname, "..", "..", "images", "books");
const FILE_PATH = path.join(
  "C:",
  "Users",
  "Pc",
  "Desktop",
  "js",
  "libraryReact",
  "library",
  "public",
  "images",
  "books"
);
const validateCreateBook = require("../utils/validateCreateBook");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");

const getAllBooksController = asyncErrorHandler(async (req, res, next) => {
  // console.log(process.env.NODE_ENV);
  if (!validateGetAllBooks(req)) {
    const error = new CustomError("No such page.", 404);
    return next(error);
  }
  console.log("requiredGenre=", req.query.requiredGenre);
  const genreId = req?.query?.requiredGenre;
  console.log("genreId=", genreId);
  if (genreId) {
    const data = await getAllBooksByGenreId(
      genreId,
      parseInt(req.query.page),
      parseInt(req.query.limit)
    );
    return res.status(200).json(data);
  }
  const genresArray =
    req.query.ignoredGenres.length > 2
      ? getGenres(req.query.ignoredGenres)
      : [];
  if (!genresArray)
    return res.status(404).json({ message: "Problem with genres." });
  console.log("igGen=", req.query.ignoredGenres);
  const data = await getAllBooks(
    parseInt(req.query.page),
    parseInt(req.query.limit),
    genresArray,
    req.query.searchWord
  );

  return res.status(200).json(data);
});

const getBookByIdController = asyncErrorHandler(async (req, res, next) => {
  const data = await getBookById(req.params.id);
  return res.json(data);
});

const createBookController = asyncErrorHandler(async (req, res, next) => {
  const valid = validateCreateBook(req);
  if (!valid)
    return res.status(401).json({ message: "All fields are required" });
  const genresArray = getGenres(req.body.genres);
  if (!genresArray)
    return res.status(404).json({ message: "Problem with genres." });
  console.log(genresArray);
  console.log("file=", req.file);
  let filePath = req?.file
    ? getFilePath(req.file.originalname, FILE_PATH)
    : null;
  console.log("filePath", filePath);
  const bookValues = [req.body.title, req.body.desc, filePath, req.body.author];
  await createBook(bookValues, genresArray);
  if (req?.file) fs.writeFileSync(filePath, req.file.buffer);
  return res.status(201).json("The book has been created");
});

const updateBookController = asyncErrorHandler(async (req, res, next) => {
  const valid = validateCreateBook(req);
  if (!valid)
    return res.status(401).json({ message: "All fields are required" });
  const values = [
    req.body.title,
    req.body.desc,
    req.body.author,
    req.params.id,
  ];

  await updateBook(values);
  return res
    .status(201)
    .json({ message: "The book has been modified successfully" });
});

const changeCoverController = asyncErrorHandler(async (req, res, next) => {
  const book = await getBookById(req.params.id);
  deleteImage(book.cover);
  let filePath = req?.file
    ? getFilePath(req.file.originalname, FILE_PATH)
    : null;
  const values = [filePath, req.params.id];
  console.log("values i=", values);
  await changeCover(values);
  if (req?.file) fs.writeFileSync(filePath, req.file.buffer);
  return res.status(200).json({ message: "The book cover has been changed." });
});

const changeGenresController = asyncErrorHandler(async (req, res, next) => {
  if (!req?.body?.genres || !Array.isArray(req.body.genres) || !req?.params?.id)
    return res.status(404).json({ message: "the imput is not valid" });
  const genresArray = req.body.genres;
  for (let genre of genresArray) {
    if (typeof genre !== "number")
      return res.status(404).json({ message: "the imput is not valid 2" });
  }

  await changeGenres(genresArray, req.params.id);
  return res.status(200).json({ message: "The genres have been changed" });
});

const deleteBookController = asyncErrorHandler(async (req, res, next) => {
  const book = await getBookById(req.params.id);
  if (!book) return res.status(201).json("Book doesn't exist.");
  await deleteBook(req.params.id);
  deleteImage(book.cover);
  return res.status(201).json("Book has been deleted successfully");
});
module.exports = {
  getAllBooksController,
  getBookByIdController,
  createBookController,
  updateBookController,
  deleteBookController,
  changeCoverController,
  changeGenresController,
};
