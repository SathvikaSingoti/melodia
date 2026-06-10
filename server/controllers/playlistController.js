const Playlist = require('../models/Playlist');

exports.createPlaylist = async (req, res) => {
  try {
    console.log('POST /api/playlists req.body:', req.body);
    const userId = req.user.id;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const playlist = await Playlist.create({
      userId,
      name,
      songs: [],
      coverUrl: ''
    });

    res.status(201).json(playlist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id).populate('songs');
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    res.json(playlist);
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addSongToPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { songId } = req.body;
    const playlist = await Playlist.findByIdAndUpdate(
      id,
      { $addToSet: { songs: songId } },
      { new: true }
    ).populate('songs');
    res.json(playlist);
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const { id, songId } = req.params;
    const playlist = await Playlist.findByIdAndUpdate(
      id,
      { $pull: { songs: songId } },
      { new: true }
    ).populate('songs');
    res.json(playlist);
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
