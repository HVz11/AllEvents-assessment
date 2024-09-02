import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import './App.css';

// Lazy load the ArtistInfo component
const ArtistInfo = React.lazy(() => import('./ArtistInfo'));

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

  useEffect(() => {
    const debounceFetchSuggestions = setTimeout(() => {
      if (query.trim()) {
        fetchSuggestions();
      }
    }, 200);

    return () => clearTimeout(debounceFetchSuggestions);
  }, [query]);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_BASEURL}/search?q=${query}`);
      const artists = response.data;

      const matchedArtist = artists.find((artist: { name: string }) => artist.name.toLowerCase() === query.toLowerCase());

      if (matchedArtist) {
        setArtistData({
          name: matchedArtist.name,
          genre: matchedArtist.genre,
          location: matchedArtist.location,
          imageUrl: matchedArtist.profilePhoto,
        });
        setSuggestions([]);
        setShowSuggestions(false);
      } else {
        setSuggestions(artists.slice(0, 5).map((artist: { name: string }) => artist.name));
        setArtistData(null);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSuggestionClick = (artistName: string) => {
    setQuery(artistName);
    setShowSuggestions(false);
    fetchSuggestions();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSuggestions();
  };

  const handleBackClick = () => {
    setQuery('');
    setArtistData(null);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="container">
      <h1 className={artistData ? 'fixed' : ''}>Find Your Favorite Music Artist</h1>
      <form onSubmit={handleSearchSubmit} className="search-container">
        <input
          type="text"
          placeholder="Search for artists..."
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={artistData !== null}
        />
        {artistData ? (
          <button type="button" className="submit-button" onClick={handleBackClick}>
            Back
          </button>
        ) : (
          <button type="submit" className="submit-button">
            Search
          </button>
        )}
      </form>

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
        <Suspense fallback={<div>Loading artist details...</div>}>
          <ArtistInfo data={artistData} />
        </Suspense>
      )}
    </div>
  );
};

export default App;
