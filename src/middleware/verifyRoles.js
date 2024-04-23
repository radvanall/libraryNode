const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const result = allowedRoles.includes(req.roles);
    if (!result) return res.sendStatus(401);
    next();
  };
};
module.exports = verifyRoles;
