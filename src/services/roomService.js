const Room = require('../models/Room');

const getListRoomsByUserId = async (uid) => {
  try {
    if (!uid) {
      return null;
    }

    const rooms = await Room.find({ $or: [{ 'user1.id': uid }, { 'user2.id': uid }] });

    return rooms;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  getListRoomsByUserId,
};
