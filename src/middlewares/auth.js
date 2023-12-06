const jwt = require('jsonwebtoken');

const config = process.env;

const verifyToken = (req, res, next) => {
  let token = req.body.token || req.headers.authorization || req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7); // Remove "Bearer " from the beginning
  }
  try {
    const { id } = jwt.verify(token, config.ACCESS_TOKEN);
    req.uid = id;
  } catch (err) {
    console.log(err);
    return res.status(401).send('Invalid Token');
  }
  return next();
};

module.exports = {
  verifyToken
};
