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
      coverUrl: `https://picsum.photos/seed/${encodeURIComponent(name)}/400/400`
    });

    res.status(201).json(playlist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
