const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  validateEmail
} = require('../utils/validateField');
const {
  generateAccessToken
} = require('../services/jwtService');
const dotenv = require('dotenv').config();
const {
  client: redisClient,
  exists,
  set,
  get,
  hgetall,
  sadd,
  zadd,
  hmget,
  smembers,
  sismember,
  srem,
  sub,
  auth: runRedisAuth,
} = require("../middlewares/redis");
const {
  createUser,
  makeUsernameKey,
  createPrivateRoom,
  sanitise,
  getMessages,
} = require("../middlewares/utils");
const session = require("express-session");

// const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     if (!email && !password) {
//       return res.status(400).json({
//         message: 'Missing required field!'
//       });
//     }

//     if (!validateEmail(email)) {
//       return res.status(400).json({
//         message: 'Invalid email!'
//       });
//     }

//     const user = await User.findOne({ email });

//     if (user && (await bcrypt.compare(password, user.password))) {
//       const token = generateAccessToken({ id: user._id });

//       return res.status(200).json({
//         message: 'Authentication success!',
//         access_token: `Bearer ${token}`
//       });
//     } else {
//       return res.status(401).json({ message: 'Authentication failed!' });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: 'Internal server error'
//     });
//   }
// };


const register = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;
    // Check validate
    if (!email || !password) {
      return res.status(400).json({
        message: 'Missing required field!'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'Invalid email!'
      });
    }

    // Check user exist
    const user = await User.findOne({
      email
    });
    if (user) {
      return res.status(409).json({
        message: 'User already exist!'
      });
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword
    });

    return res.status(201).json({
      message: 'Register successfully',
      data: newUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized: Missing token'
      });
    }
    const {
      id: userId
    } = jwt.decode(token, process.env.ACCESS_TOKEN);
    const accessToken = generateAccessToken({
      id: userId
    });
    return res.status(200).json({
      message: 'Refresh token successfully!',
      access_token: `Bearer ${accessToken}`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};


const login = async (req, res, next) => {
  const {
    username,
    password
  } = req.body;
  const usernameKey = makeUsernameKey(username);
  const userExists = await exists(usernameKey);
  if (!userExists) {
    const newUser = await createUser(username, password);
    /** @ts-ignore */
    req.session.user = newUser;
    return res.status(201).json(newUser);
  } else {
    const userKey = await get(usernameKey);
    const data = await hgetall(userKey);
    if (await bcrypt.compare(password, data.password)) {
      const user = {
        id: userKey.split(":").pop(),
        username
      };
      /** @ts-ignore */
      console.log(req.session);
      req.session.user = user;
      return res.status(200).json(user);
    }
  }
  // user not found
  return res.status(404).json({
    message: "Invalid username or password"
  });
};

const logout = async (req, res, next) => {
  req.session.destroy(() => {});
  return res.sendStatus(200);
};



module.exports = {
  login,
  register,
  refreshToken,
  logout
};