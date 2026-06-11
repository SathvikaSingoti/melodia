const { GoogleGenerativeAI } = require('@google/generative-ai');
const Playlist = require('../models/Playlist');
const LikedSong = require('../models/LikedSong');
const Song = require('../models/Song');

exports.generatePlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userPrompt = req.body.prompt;
    
    // 1. Get available catalog
    const allSongs = await Song.find({});
    const catalogInfo = allSongs
      .map(song => `ID: ${song._id.toString()} | "${song.title}" by ${song.artist} (${song.genre}, Mood: ${song.mood || 'unknown'})`)
      .join('\n');
      
    // 2. Send to Gemini 2.5 Flash
    const prompt = `User wants: '${userPrompt}'. \nFrom this song catalog:\n[${catalogInfo}]\nPick the 6 most fitting songs. Return ONLY a JSON array of song IDs. Do not include any markdown, backticks, or explanation. Only return a raw valid JSON array of strings.`;
    
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
    const playlistName = userPrompt || `✨ AI Mix - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    
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
