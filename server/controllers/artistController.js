const Artist = require('../models/Artist');

exports.getArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findById(id).populate('songs');
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.json(artist);
  } catch (error) {
    console.error('Error fetching artist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
