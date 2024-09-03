import React, { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import axios from 'axios';
import './App.css';
import { SpeedInsights } from "@vercel/speed-insights/react";

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
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const debounceFetchSuggestions = setTimeout(() => {
      if (query.trim()) {
        fetchSuggestions();
      }
    }, 300);

    return () => clearTimeout(debounceFetchSuggestions);
  }, [query, fetchSuggestions]);

  const handleSuggestionClick = useCallback((artistName: string) => {
    setQuery(artistName);
    setShowSuggestions(false);
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleBackClick = useCallback(() => {
    setQuery('');
    setArtistData(null);
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  const suggestionButtons = useMemo(() => {
    return suggestions.map((artist) => (
      <button
        key={artist}
        onClick={() => handleSuggestionClick(artist)}
        className="suggestion-button"
      >
        {artist}
      </button>
    ));
  }, [suggestions, handleSuggestionClick]);

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

      {loading && <div className="loader">Loading...</div>}

      {showSuggestions && !loading && (
        <div className="suggestions">
          <h3>Suggestions</h3>
          <div className="suggestion-buttons">
            {suggestionButtons}
          </div>
        </div>
      )}

      {artistData && (
        <Suspense fallback={<div>Loading artist details...</div>}>
          <ArtistInfo data={artistData} />
        </Suspense>
      )}

      <SpeedInsights />
    </div>
  );
};

export default App;
