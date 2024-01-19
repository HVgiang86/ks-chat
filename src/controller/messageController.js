const Message = require('../models/Message');

const getMessageByRoomId = async (req, res, next) => {
  try {
    const { roomId } = req.query;

    if (!roomId) {
      return res.status(400).json({
        message: 'Room id is required!',
      });
    }

    const listMessage = await Message.find({
      roomId,
    });

    return res.status(200).json({
      message: 'Find message success!',
      data: listMessage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error!',
    });
  }
};

const postMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, roomId, type } = req.body;
    const { uid } = req;
    console.log(req.body);
    if (!senderId || !receiverId || !message || !roomId) {
      return res.status(400).json({
        message: 'Missing required field!',
      });
    }

    if (senderId !== uid && receiverId !== uid) {
      return res.status(403).json({
        message: 'Forbidened!',
      });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: message,
      roomId: roomId,
      type: type,
    });

    if (!newMessage) {
      return res.status(400).json({
        message: 'Cannot create message!',
      });
    }

    return res.status(200).json({
      message: 'Message created!',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error!',
    });
  }
};

module.exports = {
  getMessageByRoomId,
  postMessage,
};
