import React, { useState, useEffect, Suspense, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import { SpeedInsights } from "@vercel/speed-insights/react";

const ArtistInfo = React.lazy(() => import('./ArtistInfo'));

interface Artist {
  name: string;
  genre: string;
  location: string;
  imageUrl: string;
}

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Artist[]>([]);
  const [artistData, setArtistData] = useState<Artist | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [artistDetailsLoading, setArtistDetailsLoading] = useState<boolean>(false);

  const fetchSuggestions = useCallback(async () => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_BASEURL}/search?query=${query}`);
      const artists = response.data;

      setSuggestions(artists.slice(0, 8));
      setShowSuggestions(!artistData);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [query, artistData]);

  useEffect(() => {
    const debounceFetchSuggestions = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceFetchSuggestions);
  }, [query, fetchSuggestions]);

  const handleSuggestionClick = useCallback(async (artist: Artist) => {
    setQuery(artist.name);
    setShowSuggestions(false);
    setArtistDetailsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setArtistData(artist);
    } catch (error) {
      console.error('Error fetching artist details:', error);
    } finally {
      setArtistDetailsLoading(false);
    }
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  }, [suggestions, handleSuggestionClick]);

  const handleBackClick = useCallback(() => {
    setQuery('');
    setArtistData(null);
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  return (
    <div className="container">
      <h1 className={artistData ? 'fixed' : ''}>Find Your Favorite Music Artist</h1>
      <div className="search-wrapper">
        <form onSubmit={handleSearchSubmit} className="search-container">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Search for artists..."
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => !artistData && setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && !artistData && (
              <div className="dropdown">
                {suggestions.map((artist) => (
                  <div
                    key={artist.name}
                    className="dropdown-item"
                    onClick={() => handleSuggestionClick(artist)}
                  >
                    {artist.name}
                  </div>
                ))}
              </div>
            )}
          </div>
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
      </div>

      {loading && <div className="loader">Loading suggestions...</div>}

      {artistDetailsLoading && <div className="loader">Loading artist details...</div>}

      {artistData && !artistDetailsLoading && (
        <Suspense fallback={<div className="loader">Loading artist details...</div>}>
          <ArtistInfo data={artistData} />
        </Suspense>
      )}

      <SpeedInsights />
    </div>
  );
};

export default App;