const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
  {
    status: { type: String, default: 'ACTIVE' },
    user1: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      uri: { type: String },
      nick_name: { type: String },
    },
    user2: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      uri: { type: String },
      nick_name: { type: String },
    },
  },
  {
    timestamps: true,
    collection: 'Room',
  }
);

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;
