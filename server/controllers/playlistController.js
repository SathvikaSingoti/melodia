const Playlist = require('../models/Playlist');

exports.createPlaylist = async (req, res) => {
  try {
    const { userId, name } = req.body;
    if (!userId || !name) {
      return res.status(400).json({ message: 'UserId and name are required' });
    }

    const playlist = await Playlist.create({
      userId,
      name,
      songs: [],
      coverUrl: `https://picsum.photos/seed/${encodeURIComponent(name)}/400/400`
    });

    res.status(201).json(playlist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
