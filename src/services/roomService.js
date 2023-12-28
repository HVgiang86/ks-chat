const Room = require('../models/Room');

const getListRoomsByUserId = async (uid) => {
  try {
    if (!uid) {
      return null;
    }

    const rooms = await Room.find({
      $or: [{
        'user1.id': uid
      }, {
        'user2.id': uid
      }]
    });

    return rooms;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createRoom = async (uid1, uid2) => {
  try {
    if (!uid1 || !uid2) {
      return null;
    }

    const newRoom = await Room.create({
      user1: {
        id: uid1,
      },
      user2: {
        id: uid2,
      },
    });

    return newRoom;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  getListRoomsByUserId,
  createRoom
};