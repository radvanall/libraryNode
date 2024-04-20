const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    console.log("allowedRoles=", allowedRoles);
    // const rolesArray = [...allowedRoles];
    // console.log(rolesArray);
    console.log(req.roles);
    // const result = rolesArray.includes(req.roles);
    const result = allowedRoles.includes(req.roles);
    if (!result) return res.sendStatus(401);
    next();
  };
};
module.exports = verifyRoles;
