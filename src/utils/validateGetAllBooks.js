const validateGetAllBooks = (req) => {
  if (!req?.query?.page) return false;
  if (!req?.query?.limit) return false;
  return true;
};
module.exports = validateGetAllBooks;
