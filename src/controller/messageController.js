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

module.exports = {
  getMessageByRoomId,
};
