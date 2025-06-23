import React, { useState } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapboxLocationPicker = ({ onSelect }) => {
  const [marker, setMarker] = useState({ lng: 77.209, lat: 28.6139 });
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Call Mapbox Geocoding API to fetch suggestions as user types
  const fetchSuggestions = async (value) => {
    if (!value) {
      setSuggestions([]);
      return;
    }
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        value
      )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`
    );
    const data = await res.json();
    setSuggestions(data.features || []);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSelectSuggestion = (place) => {
    const [lng, lat] = place.center;
    setMarker({ lng, lat });
    setQuery(place.place_name);
    setSuggestions([]);
    onSelect({ lng, lat, placeName: place.place_name });
  };

  const handleMapClick = (e) => {
    const { lng, lat } = e.lngLat;
    setMarker({ lng, lat });
    onSelect({ lng, lat, placeName: query });
  };

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        className="border border-gray-300 rounded p-2 w-full mb-2"
        placeholder="Search location..."
        value={query}
        onChange={handleInputChange}
      />

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="border border-gray-300 rounded bg-white max-h-40 overflow-y-auto mb-2">
          {suggestions.map((place) => (
            <li
              key={place.id}
              className="p-2 cursor-pointer hover:bg-blue-100"
              onClick={() => handleSelectSuggestion(place)}
            >
              {place.place_name}
            </li>
          ))}
        </ul>
      )}

      {/* Map */}
      <div className="w-full h-96">
        <Map
          mapLib={import('maplibre-gl')}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: marker.lng,
            latitude: marker.lat,
            zoom: 10,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onClick={handleMapClick}
        >
          <Marker longitude={marker.lng} latitude={marker.lat} />
        </Map>
      </div>
    </div>
  );
};

export default MapboxLocationPicker;
