const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: false },
    gender: { type: String, required: false },
    bio: { type: String },
    interest: { type: String },
    country: { type: String, default: 'VN' },
    avatar: { type: String },
    publicUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    friendList: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
    collection: 'User',
  }
);

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
