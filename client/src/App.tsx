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
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const fetchSuggestions = async () => {
    if (query.trim() === '') {
      setSuggestions([]);
      setArtistData(null);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/artists/search?q=${query}`);
      const artists = response.data;

      // Check if the query matches an artist's name exactly
      const matchedArtist = artists.find((artist: { name: string }) => artist.name.toLowerCase() === query.toLowerCase());

      if (matchedArtist) {
        // If an exact match is found, show the artist details and hide suggestions
        setArtistData({
          name: matchedArtist.name,
          genre: matchedArtist.genre,
          location: matchedArtist.location,
          imageUrl: matchedArtist.profilePhoto,
        });
        setSuggestions([]);
        setShowSuggestions(false);
      } else {
        // If no exact match, show suggestions and clear artist details
        setSuggestions(artists.map((artist: { name: string }) => artist.name));
        setArtistData(null);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSuggestions();
  };

  const handleSuggestionClick = (artistName: string) => {
    // Set the query to the selected suggestion and fetch artist details
    setQuery(artistName);
    setShowSuggestions(false); // Hide suggestions after selection
    fetchSuggestions(); // Fetch details for the selected artist
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

      {/* Render the suggestions only if showSuggestions is true */}
      {showSuggestions && (
        <div className="suggestions">
          <h3>Suggestions</h3>
          <div className="suggestion-buttons">
            {suggestions.map((artist) => (
              <button
                key={artist}
                onClick={() => handleSuggestionClick(artist)}
                className="suggestion-button"
              >
                {artist}
              </button>
            ))}
          </div>
        </div>
      )}

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
