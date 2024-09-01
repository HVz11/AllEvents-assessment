import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [artistData, setArtistData] = useState<{
    name: string;
    genre: string;
    location: string;
    imageUrl: string;
  } | null>(null);

  const fetchSuggestions = async () => {
    if (query.trim() === '') {
      setSuggestions([]);
      setArtistData(null);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/artists/search?q=${query}`);
      setSuggestions(response.data.map((artist: { name: string }) => artist.name));
      if (response.data.length > 0) {
        const firstArtist = response.data[0];
        setArtistData({
          name: firstArtist.name,
          genre: firstArtist.genre,
          location: firstArtist.location,
          imageUrl: firstArtist.profilePhoto,
        });
      } else {
        setArtistData(null);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSuggestions();
  };

  return (
    <div className="container">
      <h1>Find Your Favorite Music Artist</h1>
      <form onSubmit={handleSubmit} className="search-container">
        <input
          type="text"
          placeholder="Search for artists..."
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="submit-button">Search</button>
      </form>
      <div className="suggestions">
        <h3>Suggestions</h3>
        <div className="suggestion-buttons">
          {suggestions.map((artist) => (
            <button
              key={artist}
              onClick={() => setQuery(artist)}
              className="suggestion-button"
            >
              {artist}
            </button>
          ))}
        </div>
      </div>
      {artistData && (
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