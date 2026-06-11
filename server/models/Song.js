const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  artist: {
    type: String,
    required: true,
    trim: true,
  },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  },
  album: {
    type: String,
    trim: true,
  },
  genre: {
    type: String,
    trim: true,
  },
  mood: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number, // in seconds
    required: true,
  },
  audioUrl: {
    type: String,
    required: true,
  },
  coverUrl: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);
