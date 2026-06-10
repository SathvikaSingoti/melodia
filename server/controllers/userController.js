const LikedSong = require('../models/LikedSong');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

exports.getLikedSongs = async (req, res) => {
  try {
    const userId = req.user.id;
    const likedSongs = await LikedSong.find({ user: userId }).populate('song');
    // Map to return just the songs array for the frontend
    const songs = likedSongs.map(ls => ls.song).filter(Boolean);
    res.json(songs);
  } catch (error) {
    console.error('Error fetching liked songs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.likeSong = async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId } = req.body;
    
    const existing = await LikedSong.findOne({ user: userId, song: songId });
    if (!existing) {
      await LikedSong.create({ user: userId, song: songId });
    }
    
    res.json({ message: 'Song liked successfully' });
  } catch (error) {
    console.error('Error liking song:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unlikeSong = async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId } = req.params;
    await LikedSong.findOneAndDelete({ user: userId, song: songId });
    res.json({ message: 'Song unliked successfully' });
  } catch (error) {
    console.error('Error unliking song:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user.id;
    const playlists = await Playlist.find({ userId: userId }).populate('songs');
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
