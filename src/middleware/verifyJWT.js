const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  console.log(authHeader);
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.login = decoded.username;
    req.roles = decoded.roles;
    next();
  } catch (err) {
    if (err) return res.sendStatus(403);
  }
}
module.exports = verifyJWT;
