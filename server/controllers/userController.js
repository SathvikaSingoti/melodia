const LikedSong = require('../models/LikedSong');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
const User = require('../models/User');
const PlayHistory = require('../models/PlayHistory');
const admin = require('../config/firebase');
const { getStorage } = require('firebase-admin/storage');
const { getApps } = require('firebase-admin/app');
const fs = require('fs');
const path = require('path');

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

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Only allow users to update their own profile
    if (userId !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { username, avatarBase64, favoriteGenres, favoriteArtists, onboardingCompleted } = req.body;
    
    let updateData = {};
    if (username) updateData.username = username;
    if (favoriteGenres) updateData.favoriteGenres = favoriteGenres;
    if (favoriteArtists) updateData.favoriteArtists = favoriteArtists;
    if (typeof onboardingCompleted === 'boolean') updateData.onboardingCompleted = onboardingCompleted;
    
    if (avatarBase64 && avatarBase64.startsWith('data:image')) {
      const base64EncodedImageString = avatarBase64.split(';base64,').pop();
      const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');
      const filename = `avatars/${userId}_${Date.now()}.jpg`;

      if (getApps().length === 0) {
        // Local fallback if Firebase is not configured
        const publicDir = path.join(__dirname, '../public');
        const avatarsDir = path.join(publicDir, 'avatars');
        if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
        if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir);
        
        fs.writeFileSync(path.join(publicDir, filename), imageBuffer);
        updateData.avatarUrl = `http://localhost:5000/${filename}`;
      } else {
        // Firebase upload
        const bucket = getStorage().bucket();
        const file = bucket.file(filename);
        
        await file.save(imageBuffer, {
          metadata: { contentType: 'image/jpeg' },
          public: true,
        });
        
        updateData.avatarUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-passwordHash');
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error updating user' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    if (userId !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const count = await PlayHistory.countDocuments({ user: userId });
    
    // Seed data if no history exists
    if (count === 0) {
      const randomSongs = await Song.aggregate([{ $sample: { size: 50 } }]);
      if (randomSongs.length > 0) {
        const now = Date.now();
        const histories = randomSongs.map(song => {
          // random time in the last 7 days
          const randomOffset = Math.random() * 7 * 24 * 60 * 60 * 1000;
          return {
            user: userId,
            song: song._id,
            playedAt: new Date(now - randomOffset),
            duration: song.duration
          };
        });
        await PlayHistory.insertMany(histories);
      }
    }

    const history = await PlayHistory.find({ user: userId })
      .sort({ playedAt: -1 })
      .limit(200)
      .populate('song');
      
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Server error fetching history' });
  }
};

exports.addHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    if (userId !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { songId, duration } = req.body;
    if (!songId) {
      return res.status(400).json({ message: 'songId is required' });
    }

    const newHistory = await PlayHistory.create({
      user: userId,
      song: songId,
      duration: duration || 0
    });

    res.json(newHistory);
  } catch (error) {
    console.error('Error adding history:', error);
    res.status(500).json({ message: 'Server error adding history' });
  }
};
