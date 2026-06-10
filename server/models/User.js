const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: false, // Optional if using Google OAuth
  },
  googleId: {
    type: String,
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
