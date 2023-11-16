const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      res.status(400).json({
        message: 'Missing required field!'
      });
    }
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
        expiresIn: '2h'
      });

      return res.status(200).json({
        message: 'Login successfully',
        access_token: `Bearer ${token}`
      });
    } else {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Check validate
    if (!(email && password)) {
      return res.status(400).json({
        message: 'Missing required field!'
      });
    }

    // Check user exist
    const user = await User.findOne({ email });
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

    return res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

module.exports = {
  login,
  register
};
