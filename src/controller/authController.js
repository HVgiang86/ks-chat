const dotenv = require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateEmail } = require('../utils/validateField');
const { generateAccessToken, generateRefreshToken } = require('../services/jwtService');

const User = require('../models/User');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res.status(400).json({
        message: 'Missing required field!'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'Invalid email!'
      });
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateAccessToken({ id: user._id });
      const refresh_token = generateRefreshToken({ id: user._id });

      return res.status(200).json({
        message: 'Authentication success!',
        access_token: token,
        refresh_token: refresh_token
      });
    }
    return res.status(401).json({ message: 'Authentication failed!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
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
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: 'User already exist!'
      });
    }

    // Encrypt user password
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
    const token = req.cookies.refresh_token || req.body.refresh_token.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized: Missing token'
      });
    }
    const { id: userId } = jwt.decode(token, process.env.ACCESS_TOKEN);
    const accessToken = generateAccessToken({ id: userId });
    return res.status(200).json({
      message: 'Refresh token successfully!',
      access_token: accessToken
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

module.exports = {
  login,
  register,
  refreshToken
};
