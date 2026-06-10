const mongoose = require('mongoose');

const likedSongSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  songId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true,
  },
}, { timestamps: true });

// Prevent duplicate likes for the same song by the same user
likedSongSchema.index({ userId: 1, songId: 1 }, { unique: true });

module.exports = mongoose.model('LikedSong', likedSongSchema);
