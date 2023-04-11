const jwt = require("jsonwebtoken");

const createToken = (payload) => {
    return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRESIN,
    });
  };

  module.exports = createToken;