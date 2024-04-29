const {
  getCommentByBookId,
  getTotalNrOfCommentsByUserId,
  getCommentByUserId,
  editComment,
  deleteComment,
} = require("../model/comment");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const getCommentByBookIdController = asyncErrorHandler(
  async (req, res, next) => {
    if (
      !req?.query?.id ||
      !req?.query?.totalComments ||
      !req?.query?.limit ||
      !req?.query?.page
    ) {
      const error = new CustomError("There is no book id.", 404);
      return next(error);
    }
    const data = await getCommentByBookId(
      parseInt(req.query.id),
      parseInt(req.query.totalComments),
      parseInt(req.query.limit),
      parseInt(req.query.page)
    );
    return res.status(200).json(data);
  }
);
const getNrOfCommentsByUserIdController = asyncErrorHandler(
  async (req, res, next) => {
    if (!req?.params?.id) {
      const error = new CustomError("The id is required", 404);
      return next(error);
    }
    const nrOfComments = await getTotalNrOfCommentsByUserId(req.params.id);
    return res.status(200).json(nrOfComments);
  }
);

const getCommentByUserIdController = asyncErrorHandler(
  async (req, res, next) => {
    if (
      !req?.query?.id ||
      !req?.query?.totalComments ||
      !req?.query?.limit ||
      !req?.query?.page
    ) {
      const error = new CustomError("There is no user id.", 404);
      return next(error);
    }
    const data = await getCommentByUserId(
      parseInt(req.query.id),
      parseInt(req.query.totalComments),
      parseInt(req.query.limit),
      parseInt(req.query.page)
    );
    return res.status(200).json(data);
  }
);
const editCommentController = asyncErrorHandler(async (req, res, next) => {
  if (!req?.params?.id || !req?.body?.comment) {
    const error = new CustomError("There is no comment id.", 404);
    return next(error);
  }
  const values = [req.body.comment, req.params.id];
  await editComment(values);
  return res.status(200).json({ message: "The comment has been modified." });
});

const deleteCommentController = asyncErrorHandler(async (req, res, next) => {
  if (!req?.params?.id) {
    const error = new CustomError("There is no comment id.", 404);
    return next(error);
  }
  await deleteComment(req.params.id);
  return res.status(200).json({ message: "The comment has been removed." });
});

module.exports = {
  getCommentByBookIdController,
  getNrOfCommentsByUserIdController,
  getCommentByUserIdController,
  editCommentController,
  deleteCommentController,
};
