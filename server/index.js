require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/songs', require('./routes/songs'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/users', require('./routes/users'));
app.use('/api/ai', require('./routes/ai'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const { MongoMemoryServer } = require('mongodb-memory-server');

// Database connection
async function startServer() {
  try {
    let mongoUri = process.env.MONGO_URI;
    
    // Use memory server if default placeholder is detected
    if (mongoUri.includes('your_jwt_secret') || mongoUri.includes('mongodb+srv://user:password')) {
      console.log('Detected placeholder MongoDB URI. Using mongodb-memory-server for testing...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

startServer();
