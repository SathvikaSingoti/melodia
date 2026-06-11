const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const User = require('../models/User');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:5000/api/auth/google/callback'
);

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Account already exists. Login instead?' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email: email.toLowerCase(),
      passwordHash,
    });

    await newUser.save();

    const token = generateToken(newUser._id);
    
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        onboardingCompleted: newUser.onboardingCompleted,
        avatarUrl: newUser.avatarUrl,
        favoriteGenres: newUser.favoriteGenres,
        favoriteArtists: newUser.favoriteArtists,
        createdAt: newUser.createdAt,
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'No account found. Sign up instead?' });
    }

    if (!user.passwordHash) {
      return res.status(400).json({ message: 'Please login with Google' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        _id: user._id,
        username: user.username,
        email: user.email,
        onboardingCompleted: user.onboardingCompleted,
        avatarUrl: user.avatarUrl,
        favoriteGenres: user.favoriteGenres,
        favoriteArtists: user.favoriteArtists,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// GET /api/auth/google
router.get('/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });
  res.redirect(url);
});

// GET /api/auth/google/callback
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).send('No code provided');

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });

    const userInfo = await oauth2.userinfo.get();
    const { id, email, name } = userInfo.data;

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = new User({
        username: name || email.split('@')[0],
        email: email.toLowerCase(),
        googleId: id,
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = id;
      await user.save();
    }

    const token = generateToken(user._id);

    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/login?token=${token}`);
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.redirect('http://localhost:3000/login?error=auth_failed');
  }
});

module.exports = router;
