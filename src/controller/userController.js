const bcrypt = require('bcryptjs');
const User = require('../models/User');

const getMe = async (req, res, next) => {
  try {
    const { uid } = req;
    if (!uid) {
      return res.status(400).json({
        message: 'Missing user id!',
      });
    }

    const user = await User.findOne({ _id: uid });
    if (!user) {
      return res.status(409).json({
        message: 'User is not exist!',
      });
    }

    return res.status(200).json({
      message: 'Find user successfully',
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: 'Missing user id!',
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(409).json({
        message: 'User is not exist!',
      });
    }
    return res.status(200).json({
      message: 'Find user successfully',
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, dateOfBirth, gender, bio, interest, country, avatar } = req.body;
    const { uid } = req;
    if (!uid) {
      return res.status(400).json({
        message: 'Missing user id!',
      });
    }

    const newData = {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      bio,
      country,
      interest,
      avatar,
    };

    const user = await User.findOne({ _id: uid });
    if (!user) {
      return res.status(409).json({
        message: 'User is not exist!',
      });
    }
    const newUser = await User.findOneAndUpdate(
      { _id: uid },
      {
        $set: newData,
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      message: 'Update user successfully',
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const changePasswordUser = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { uid } = req;
    if (!uid) {
      return res.status(400).json({
        message: 'Missing user id!',
      });
    }

    const user = await User.findOne({ _id: uid });
    if (!user) {
      return res.status(409).json({
        message: 'User is not exist!',
      });
    }
    // Compare password of user vs current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect!' });
    }
    // Encode new password
    const newEncryptedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { _id: uid },
      {
        $set: { password: newEncryptedPassword },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      message: 'Change password user successfully!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// [POST] /api/users/share-profile
const shareProfile = async (req, res, next) => {
  try {
    const { partnerId } = req.body;
    const { uid } = req;

    // Check if partner exist
    const partner = await User.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    // Update the partner's publicUsers array
    partner.publicUsers.push(uid);
    await partner.save();

    return res.status(200).json({ message: 'Added to publicUsers successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = {
  getMe,
  getUserById,
  updateUser,
  changePasswordUser,
  shareProfile,
};
