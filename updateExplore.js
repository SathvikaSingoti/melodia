const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client/src/app/explore/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Insert Recommended Above Recently Played
const recentlyPlayedMarker = `{/* Recently Played */}`;
const recommendedBlock = `
        {/* Recommended (Moved up) */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Recommended</h3>
            <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">See all</button>
          </div>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : displayedSongs.length === 0 ? (
            <div className="text-center py-20 text-gray-400 glass-panel">
              No songs found.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {displayedSongs.map((song) => (
                <div 
                  key={song._id} 
                  onClick={() => play(song, displayedSongs)}
                  className="group relative bg-bg-secondary p-4 rounded-xl border border-border hover:border-primary/50 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] cursor-pointer"
                >
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={song.coverUrl} 
                      alt={song.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-bg-primary hover:scale-105 transition-transform shadow-lg">
                        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </button>
                    </div>
                    {currentSong?._id === song._id && isPlaying && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-1">
                        <div className="w-1.5 bg-primary rounded-full animate-[equalizer_1s_ease-in-out_infinite]"></div>
                        <div className="w-1.5 bg-primary rounded-full animate-[equalizer_1.2s_ease-in-out_infinite_0.2s]"></div>
                        <div className="w-1.5 bg-primary rounded-full animate-[equalizer_0.8s_ease-in-out_infinite_0.4s]"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 pr-2">
                      <h3 className="font-semibold text-white truncate mb-1" title={song.title}>
                        {song.title}
                      </h3>
                      <p className="text-sm text-gray-400 truncate mb-3" title={song.artist}>
                        {song.artist}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => toggleLike(e, song._id)}
                        className="p-1 -mt-1 -mr-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <svg className={\`w-5 h-5 \${likedSongIds.has(song._id) ? 'text-secondary' : ''}\`} fill="currentColor" viewBox="0 0 24 24">
                          <path d={likedSongIds.has(song._id) 
                            ? "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            : "M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"}
                          />
                        </svg>
                      </button>
                      <div className="-mt-1">
                        <SongMenu song={song} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span className="bg-bg-tertiary px-2 py-1 rounded-md">{song.genre}</span>
                    <span>{formatDuration(song.duration)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Played */}`;

if(!content.includes('Recommended (Moved up)')) {
  content = content.replace(recentlyPlayedMarker, recommendedBlock);
}

// 2. Remove old Recommended Block at the bottom
const oldRecommendedIndex = content.indexOf(`{/* Songs Grid */}`);
if (oldRecommendedIndex !== -1) {
  const endingDivIndex = content.lastIndexOf(`</div>`);
  const protectedRouteIndex = content.lastIndexOf(`</ProtectedRoute>`);
  // Cut out the old recommended
  content = content.substring(0, oldRecommendedIndex) + content.substring(endingDivIndex - 6);
}

// 3. Update Trending Now
const trendingNowSearch = `{/* Trending Now */}`;
const trendingNowReplace = `{/* Trending Now */}
        {filteredAllSongs.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Trending Now</h3>
              <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">See all</button>
            </div>
            <div className="flex flex-col gap-2">
              {[...filteredAllSongs].sort((a, b) => (b.plays || 0) - (a.plays || 0)).slice(0, 8).map((song, i) => (
                <div 
                  key={song._id}
                  onClick={() => play(song, filteredAllSongs)}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-bg-secondary group cursor-pointer transition-colors border border-transparent hover:border-border"
                >
                  <div className="w-6 text-gray-500 font-bold text-center">{i + 1}</div>
                  <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-bg-primary hover:scale-105 transition-transform shadow-lg">
                        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{song.title}</h4>
                    <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                  </div>
                  <div className="hidden md:block w-24 text-right text-gray-500 text-xs">{(song.plays || 0).toLocaleString()} plays</div>
                  <div className="w-12 text-right text-sm text-gray-400 mr-2">{formatDuration(song.duration)}</div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleLike(e, song._id); }}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className={\`w-4 h-4 \${likedSongIds.has(song._id) ? 'text-secondary' : ''}\`} fill="currentColor" viewBox="0 0 24 24">
                        <path d={likedSongIds.has(song._id) 
                          ? "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          : "M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"}
                        />
                      </svg>
                    </button>
                    <div onClick={e => e.stopPropagation()}>
                      <SongMenu song={song} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}`;

// Use regex to replace the entire Trending Now section up to New Releases
const trendingRegex = /{\/\* Trending Now \*\/}[\s\S]*?(?={\/\* New Releases \*\/})/;
content = content.replace(trendingRegex, trendingNowReplace + '\n\n        ');

// 4. Update New Releases Section
const newReleasesReplace = `{/* New Releases */}
        {filteredAllSongs.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">New Releases</h3>
              <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">See all</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...filteredAllSongs].reverse().slice(0, 8).map(song => (
                <div 
                  key={song._id}
                  onClick={() => play(song, filteredAllSongs)}
                  className="bg-bg-secondary p-4 rounded-xl border border-border hover:border-primary/50 transition-all cursor-pointer group"
                >
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                    <img src={song.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="absolute bottom-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white text-bg-primary hover:scale-105 transition-transform shadow-lg">
                        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </button>
                    </div>
                  </div>
                  <h4 className="font-semibold text-white truncate">{song.title}</h4>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                </div>
              ))}
            </div>
          </div>
        )}`;

const newReleasesRegex = /{\/\* New Releases \*\/}[\s\S]*?(?={\/\* Curated Playlists \*\/})/;
content = content.replace(newReleasesRegex, newReleasesReplace + '\n\n        ');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated explore/page.tsx layout');
