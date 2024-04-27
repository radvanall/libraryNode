const {
  getCommentByBookId,
  getTotalNrOfCommentsByUserId,
  getCommentByUserId,
  editComment,
  deleteComment,
} = require("../model/comment");

const getCommentByBookIdController = async (req, res) => {
  if (
    !req?.query?.id ||
    !req?.query?.totalComments ||
    !req?.query?.limit ||
    !req?.query?.page
  )
    return res.status(404).json({ err: "There is no book id." });
  try {
    const data = await getCommentByBookId(
      parseInt(req.query.id),
      parseInt(req.query.totalComments),
      parseInt(req.query.limit),
      parseInt(req.query.page)
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const getNrOfCommentsByUserIdController = async (req, res) => {
  if (!req?.params?.id)
    return res.status(404).json({ err: "The id is required " });
  try {
    const nrOfComments = await getTotalNrOfCommentsByUserId(req.params.id);
    return res.status(200).json(nrOfComments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getCommentByUserIdController = async (req, res) => {
  if (
    !req?.query?.id ||
    !req?.query?.totalComments ||
    !req?.query?.limit ||
    !req?.query?.page
  )
    return res.status(404).json({ err: "There is no user id." });
  try {
    const data = await getCommentByUserId(
      parseInt(req.query.id),
      parseInt(req.query.totalComments),
      parseInt(req.query.limit),
      parseInt(req.query.page)
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const editCommentController = async (req, res) => {
  if (!req?.params?.id || !req?.body?.comment)
    return res.status(404).json({ err: "There is no comment id." });
  const values = [req.body.comment, req.params.id];
  try {
    await editComment(values);
    return res.status(200).json({ message: "The comment has been modified." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const deleteCommentController = async (req, res) => {
  if (!req?.params?.id)
    return res.status(404).json({ err: "There is no comment id." });
  try {
    await deleteComment(req.params.id);
    return res.status(200).json({ message: "The comment has been removed." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCommentByBookIdController,
  getNrOfCommentsByUserIdController,
  getCommentByUserIdController,
  editCommentController,
  deleteCommentController,
};
