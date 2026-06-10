const { GoogleGenerativeAI } = require('@google/generative-ai');
const Playlist = require('../models/Playlist');
const LikedSong = require('../models/LikedSong');
const Song = require('../models/Song');

exports.generatePlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 1. Get user's liked songs
    const likedSongsDoc = await LikedSong.find({ user: userId }).populate('song');
    
    const likedSongsInfo = likedSongsDoc
      .filter(doc => doc.song)
      .map(doc => `"${doc.song.title}" by ${doc.song.artist} (${doc.song.genre})`)
      .join(', ');
      
    // 2. Get available catalog
    const allSongs = await Song.find({});
    const catalogInfo = allSongs
      .map(song => `ID: ${song._id.toString()} | "${song.title}" by ${song.artist} (${song.genre})`)
      .join('\n');
      
    // 3. Send to Gemini 2.5 Flash
    const prompt = `Based on these liked songs: [${likedSongsInfo || 'User has no liked songs yet. Just recommend any good tracks'}], suggest 5 songs from this available catalog:\n[${catalogInfo}]\nReturn JSON array of song IDs only. Do not include any markdown, backticks, or explanation. Only return a raw valid JSON array of strings.`;
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Explicitly using gemini-2.5-flash as requested
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });
    
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Clean up response if needed
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const suggestedSongIds = JSON.parse(text);
    
    if (!Array.isArray(suggestedSongIds) || suggestedSongIds.length === 0) {
      throw new Error("Invalid AI response structure");
    }

    // 4. Create new playlist
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const playlistName = `✨ AI Mix - ${dateStr}`;
    
    const newPlaylist = await Playlist.create({
      userId,
      name: playlistName,
      songs: suggestedSongIds,
      isAIGenerated: true
    });
    
    res.status(201).json(newPlaylist);
  } catch (error) {
    console.error('Error generating AI playlist:', error);
    res.status(500).json({ message: 'Failed to generate smart playlist' });
  }
};
