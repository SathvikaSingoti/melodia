const Song = require('../models/Song');

exports.getSongs = async (req, res) => {
  try {
    const { genre, mood } = req.query;
    const query = {};

    if (genre) {
      let searchGenre = genre;
      if (genre.toLowerCase() === 'hip-hop') searchGenre = 'hiphop';
      else if (genre.toLowerCase() === 'r&b') searchGenre = 'rnb';
      
      query.genre = new RegExp(searchGenre.replace(/[-& ]/g, '.*'), 'i');
    }
    if (mood) {
      query.mood = mood;
    }

    const songs = await Song.find(query);
    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchSongs = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const regex = new RegExp(q, 'i');
    const songs = await Song.find({
      $or: [
        { title: regex },
        { artist: regex }
      ]
    });
    res.json(songs);
  } catch (error) {
    console.error('Error searching songs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
