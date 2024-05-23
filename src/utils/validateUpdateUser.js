const validateUpdateUser = (req) => {
  if (
    !(
      req?.body?.login &&
      req?.body?.pass &&
      req?.params?.id &&
      req?.body?.newPass
    )
  )
    return false;
  return true;
};
module.exports = validateUpdateUser;
