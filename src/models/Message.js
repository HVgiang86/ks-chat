const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    roomId: { type: String, required: true },
    type: { type: String, default: 'text' },
  },
  {
    timestamps: true,
    collection: 'Message',
  }
);

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
