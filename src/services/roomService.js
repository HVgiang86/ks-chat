const Room = require('../models/Room');

const getListRoomsByUserId = async (uid) => {
  try {
    if (!uid) {
      return null;
    }

    const rooms = await Room.find({
      $or: [
        {
          'user1.id': uid,
        },
        {
          'user2.id': uid,
        },
      ],
    });
    return rooms;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getRoomsBetweenUserId = async (uid1, uid2) => {
  try {
    if (!uid1 || !uid2) {
      console.log('Invalid param');
      return null;
    }
    const response = await Room.findOne({
      $or: [
        {
          'user1.id': uid1,
          'user2.id': uid2,
        },
        {
          'user1.id': uid2,
          'user2.id': uid1,
        },
      ],
    });

    if (response.length > 0) {
      return response;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const deleteRoom = async (uid1, uid2) => {
  try {
    if (!uid1 || !uid2) {
      console.log('Invalid param');
      return null;
    }

    const response = await getRoomsBetweenUserId(uid1, uid2);
    if (response) {
      const deletedRooms = await Room.deleteOne({
        $or: [
          {
            'user1.id': uid1,
            'user2.id': uid2,
          },
          {
            'user1.id': uid2,
            'user2.id': uid1,
          },
        ],
      });

      return deletedRooms;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const disableRoom = async (uid1, uid2) => {
  try {
    if (!uid1 || !uid2) {
      console.log('Invalid param');
      return null;
    }

    const response = await getRoomsBetweenUserId(uid1, uid2);
    if (response) {
      const disableRooms = await Room.findByIdAndUpdate(
        {
          $or: [
            {
              'user1.id': uid1,
              'user2.id': uid2,
            },
            {
              'user1.id': uid2,
              'user2.id': uid1,
            },
          ],
        },
        {
          $set: {
            status: 'INACTIVE',
          },
        }
      );

      return disableRooms;
    }
    return null;
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

const createRoomObject = async (requestObject) => {
  try {
    if (!requestObject) {
      return null;
    }

    const newRoom = await Room.create(requestObject);
    return newRoom;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  getListRoomsByUserId,
  getRoomsBetweenUserId,
  createRoom,
  deleteRoom,
  createRoomObject,
  disableRoom,
};
