const validateCreateUser = (req) => {
  if (!(req?.body?.login && req?.body?.pass)) return false;
  return true;
};
module.exports = validateCreateUser;
