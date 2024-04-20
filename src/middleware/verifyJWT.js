const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  //   const cookies = req.cookies;
  //   if (!cookies?.access) return res.sendStatus(401);

  //   const token = cookies.access;
  //   console.log("token=", token);
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  console.log(authHeader);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.login = decoded.username;
    req.roles = decoded.roles;
    next();
  });
};
module.exports = verifyJWT;
