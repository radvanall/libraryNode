const validateCreateUser = (req) => {
  if (!(req?.query?.login && req?.query?.pass)) return false;
  return true;
};
module.exports = validateCreateUser;
