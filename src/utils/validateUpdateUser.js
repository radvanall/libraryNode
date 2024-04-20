const validateUpdateUser = (req) => {
  if (!(req?.body?.login && req?.body?.pass && req?.params?.id)) return false;
  return true;
};
module.exports = validateUpdateUser;
