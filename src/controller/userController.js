const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Message = require('../models/Message');

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

const getFriendList = async (req, res, next) => {
  try {
    const { uid } = req;
    if (!uid) {
      return res.status(400).json({
        message: 'Missing user id!',
      });
    }

    const user = await User.findOne({ _id: uid }).populate('friendList');
    if (!user) {
      return res.status(409).json({
        message: 'User is not exist!',
      });
    }

    return res.status(200).json({
      message: 'Get friendList successfully',
      data: user.friendList,
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

const getAllMessage = async (req, res, next) => {
  try {
    const { uid } = req;
    if (!uid) {
      return res.status(400).json({
        message: 'Missing user id!',
      });
    }

    const listMessage = await Message.find({
      $or: [
        {
          sender: uid,
        },
        {
          receiver: uid,
        },
      ],
    });

    return res.status(200).json({
      message: 'Get list message success!',
      data: listMessage,
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

// [PUT] /api/users/un-friend
const unFriend = async (req, res, next) => {
  try {
    const { partnerId } = req.body;
    const { uid } = req;

    // Check if partner exist
    const partner = await User.findById(partnerId);
    const currentUser = await User.findById(uid);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    console.log('>>partner', partner);
    console.log('>>currentUser', currentUser);
    const indexPartner = partner.friendList.findIndex((item) => item.toString() === uid);
    const indexCurrent = currentUser.friendList.findIndex((item) => item.toString() === partnerId);

    // check if my id exist list friend
    if (indexPartner > -1 || indexCurrent > -1) {
      return res.status(304).json({
        message: 'Nothing!',
      });
    }

    partner.friendList.splice(indexPartner, 1);
    currentUser.friendList.splice(indexCurrent, 1);

    await partner.save();
    await currentUser.save();

    return res.status(200).json({ message: 'Unfriendlist successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// [PUT] /api/users/share-profile
const shareProfile = async (req, res, next) => {
  try {
    const { partnerId } = req.body;
    const { uid } = req;

    // Check if partner exist
    const partner = await User.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    // check if my id exist in partner
    const isExist = partner.publicUsers.includes(uid);
    if (isExist) {
      return res.status(304).json({
        message: 'Nothing!',
      });
    }

    partner.publicUsers.push(uid);

    const currentUser = await User.findById(uid);
    if (currentUser.publicUsers.find((item) => item.toString() === partnerId)) {
      currentUser.friendList.push(partnerId);
      partner.friendList.push(uid);
    }
    await currentUser.save();
    await partner.save();

    return res.status(200).json({ message: 'Added to publicUsers successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// [PUT] /api/users/un-share-profile
const unShareProfile = async (req, res, next) => {
  try {
    const { partnerId } = req.body;
    const { uid } = req;

    // Check if partner exist
    const partner = await User.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    // Update the partner's publicUsers array
    const index = partner.publicUsers.findIndex((item) => item.toString() === uid);

    if (index > -1) {
      partner.publicUsers.splice(index, 1);
      await partner.save();
      return res.status(200).json({ message: 'Remove from publicUsers successfully' });
    }

    return res.status(304).json({ message: 'You are not in publicUsers!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = {
  getMe,
  getFriendList,
  getUserById,
  getAllMessage,
  updateUser,
  changePasswordUser,
  shareProfile,
  unShareProfile,
  unFriend,
};
