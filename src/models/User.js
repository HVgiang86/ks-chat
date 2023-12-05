const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    bio: { type: String },
    age: { type: Number },
    interest: { type: String },
    country: { type: String, default: 'VN' },
    publicUsers: [
      {
        type: mongoose.Schema.Types.ObjectId
      }
    ]
  },
  {
    timestamps: true,
    collection: 'User'
  }
);

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
