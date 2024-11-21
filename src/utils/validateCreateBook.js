const validateCreateBook = (req) => {
  if (!req?.body?.title) return false;
  if (!req?.body?.desc) return false;
  if (!req?.body?.author) return false;
  if (!(req.body?.title?.length < 50)) return false;
  if (!(req.body?.desc?.length < 1000)) return false;
  if (!(req.body?.author?.length < 60)) return false;
  return true;
};
module.exports = validateCreateBook;
