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

const getActiveRoomsByUserId = async (uid) => {
  try {
    if (!uid) {
      return null;
    }

    const rooms = await Room.find({
      $or: [
        {
          'user1.id': uid,
          status: 'ACTIVE',
        },
        {
          'user2.id': uid,
          status: 'ACTIVE',
        },
      ],
    });
    return rooms;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getRoomsBetweenUserId = async (uid1, uid2, status) => {
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
          status: status,
        },
        {
          'user1.id': uid2,
          'user2.id': uid1,
          status: status,
        },
      ],
    });

    console.log(`GET ROOM: ${response}`);

    if (response) {
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

const disableRoom = async (uid1, uid2, status) => {
  try {
    if (!uid1 || !uid2) {
      console.log('Invalid param');
      return null;
    }

    const response = await getRoomsBetweenUserId(uid1, uid2, status);
    if (response) {
      const disableRooms = await Room.findOneAndUpdate(
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

    const roomExist = await Room.find({
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

    if (roomExist) {
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
  getActiveRoomsByUserId,
  createRoom,
  deleteRoom,
  createRoomObject,
  disableRoom,
};
