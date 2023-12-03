const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateAccessToken = (payload) => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: '60m',
  });

  return accessToken;
};

const generateRefreshToken = (payload) => {
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {
    expiresIn: '12h',
  });

  return refreshToken;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
