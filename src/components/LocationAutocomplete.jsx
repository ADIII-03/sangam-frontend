import React, { useState, useEffect, useRef } from 'react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const LocationAutocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`
      )
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data.features || []);
        })
        .catch(() => {
          setSuggestions([]);
        });
    }, 300); // 300ms debounce delay

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelect = (place) => {
    setQuery(place.place_name);
    setSuggestions([]);
    onSelect({
      lng: place.center[0],
      lat: place.center[1],
      placeName: place.place_name,
    });
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        placeholder="Search location..."
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {suggestions.length > 0 && (
        <ul className="absolute z-10 border bg-gray-950 border-gray-300 rounded w-full max-h-48 overflow-auto mt-1 shadow-lg">
          {suggestions.map((place) => (
            <li
              key={place.id}
              onClick={() => handleSelect(place)}
              className="p-2 cursor-pointer hover:bg-blue-100"
            >
              {place.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
