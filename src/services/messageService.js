const Message = require('../models/Message');

const createMessage = async ({ sender, receiver, message, roomId, type }) => {
  try {
    if (!sender || !receiver || !message || !roomId ) {
      return null;
    }

    const newMessage = await Message.create({ sender, receiver, message, roomId, type });

    return newMessage;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  createMessage,
};
