const jwt = require("jsonwebtoken");

const createToken = (userData, envVar, expirationTime) => {
  return jwt.sign(userData, envVar, { expiresIn: expirationTime });
};
module.exports = createToken;
