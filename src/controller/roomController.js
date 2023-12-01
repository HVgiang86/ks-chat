const Room = require('../models/Room');

const getListRoomsByUserId = async (req, res, next) => {
  try {
    const { uid } = req;
    if (!uid) {
      return res.status(400).json({
        message: 'Missing user id!'
      });
    }
    const rooms = await Room.find({ $or: [{ 'user1.id': uid }, { 'user2.id': uid }] });

    return res.status(200).json({
      message: 'Find room successfully',
      data: rooms
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const createRoom = async (req, res, next) => {
  try {
    const { uid } = req;
    const { partnerId } = req.body;
    if (!uid) {
      return res.status(400).json({
        message: 'Missing user id!'
      });
    }
    if (!partnerId) {
      return res.status(400).json({
        message: 'Missing partner id!'
      });
    }

    const rooms = await Room.create({
      user1: {
        id: uid < partnerId ? uid : partnerId
      },
      user2: {
        id: uid > partnerId ? uid : partnerId
      }
    });

    return res.status(200).json({
      message: 'Create room successfully',
      data: rooms
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getListRoomsByUserId,
  createRoom
};
