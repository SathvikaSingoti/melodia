const LikedSong = require('../models/LikedSong');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

exports.getLikedSongs = async (req, res) => {
  try {
    const { id } = req.params;
    const likedSongs = await LikedSong.find({ userId: id }).populate('songId');
    // Map to return just the songs array for the frontend
    const songs = likedSongs.map(ls => ls.songId).filter(Boolean);
    res.json(songs);
  } catch (error) {
    console.error('Error fetching liked songs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.likeSong = async (req, res) => {
  try {
    const { id } = req.params;
    const { songId } = req.body;
    
    const existing = await LikedSong.findOne({ userId: id, songId });
    if (!existing) {
      await LikedSong.create({ userId: id, songId });
    }
    
    res.json({ message: 'Song liked successfully' });
  } catch (error) {
    console.error('Error liking song:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unlikeSong = async (req, res) => {
  try {
    const { id, songId } = req.params;
    await LikedSong.findOneAndDelete({ userId: id, songId });
    res.json({ message: 'Song unliked successfully' });
  } catch (error) {
    console.error('Error unliking song:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserPlaylists = async (req, res) => {
  try {
    const { id } = req.params;
    const playlists = await Playlist.find({ userId: id }).populate('songs');
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
