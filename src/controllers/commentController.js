const { getCommentByBookId } = require("../model/comment");

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
module.exports = { getCommentByBookIdController };
