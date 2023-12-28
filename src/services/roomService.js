const Room = require('../models/Room');

const deleteRoom = async (roomId) => {
  try {
    if (roomId) {
      return null;
    }

    const rooms = await Room.findByIdAndDelete(roomId);

    return rooms;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  deleteRoom,
};
