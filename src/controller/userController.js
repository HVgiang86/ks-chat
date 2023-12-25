const User = require('../models/User');

const getMe = async (req, res, next) => {
  try {
    const { uid } = req;
    if (!uid) {
      return res.status(400).json({
        message: 'Missing user id!'
      });
    }

    const user = await User.findOne({ _id: uid });
    if (!user) {
      return res.status(409).json({
        message: 'User is not exist!'
      });
    }

    return res.status(200).json({
      message: 'Find user successfully',
      data: user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: 'Missing user id!'
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(409).json({
        message: 'User is not exist!'
      });
    }
    const isPublic = user.publicUsers.includes(id);
    if (isPublic) {
      return res.status(200).json({
        message: 'Find user successfully',
        data: user
      });
    }
    return res.status(200).json({
      message: 'Find user successfully',
      data: { id }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { password, firstName, lastName, dateOfBirth, gender, bio, age, interest } = req.body;
    const { uid } = req;
    if (!uid) {
      return res.status(400).json({
        message: 'Missing user id!'
      });
    }

    const newData = {
      password,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      bio,
      age,
      interest
    };

    const user = await User.findOne({ _id: uid });
    if (!user) {
      return res.status(409).json({
        message: 'User is not exist!'
      });
    }
    const newUser = await User.findOneAndUpdate(
      { _id: uid },
      {
        $set: newData
      },
      {
        new: true
      }
    );
    return res.status(200).json({
      message: 'Update user successfully',
      data: newUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getMe,
  getUserById,
  updateUser
};
