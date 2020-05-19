const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024
  },
  date: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: {
    type: String,
    required: false,
    min: 6,
    max: 1024
  },
  resetPasswordExpires: {
    type: Date,
    required: false
  }
});

module.exports = mongoose.model('user', userSchema);
