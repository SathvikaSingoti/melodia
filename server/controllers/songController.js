const Song = require('../models/Song');

exports.getSongs = async (req, res) => {
  try {
    const { genre, mood } = req.query;
    const query = {};

    if (genre) {
      query.genre = genre;
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
