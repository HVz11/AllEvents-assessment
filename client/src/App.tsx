import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  const suggestions = [
    'Drake',
    'Taylor Swift',
    'Ed Sheeran',
    'Beyonce',
    'Post Malone',
    'Nicki Minaj',
    'Kanye West',
    'Ariana Grande',
  ];

  const artistData = {
    name: 'Post Malone',
    genre: 'Hip-Hop, POP',
    location: 'USA',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Post_Malone_July_2021_%28cropped%29.jpg',
  };

  return (
    <div className="container">
      <h1>Find your favourite Music Artist</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search artists..."
          className="search-input"
        />
      </div>
      <div className="suggestions">
        <h3>Suggestions</h3>
        <div className="suggestion-buttons">
          {suggestions.map((artist) => (
            <button
              key={artist}
              onClick={() => setSelectedArtist(artist)}
              className="suggestion-button"
            >
              {artist}
            </button>
          ))}
        </div>
      </div>
      {selectedArtist && (
        <div className="artist-info">
          <img
            src={artistData.imageUrl}
            alt={artistData.name}
            className="artist-image"
          />
          <div className="artist-details">
            <h2>{artistData.name}</h2>
            <p>{artistData.genre}</p>
            <p>{artistData.location}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
