import React, { useState } from "react";

const Home = () => {
  const [sharingLocation, setSharingLocation] = useState(false);

  const getLocation = (options) =>
    new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );

  const getIPLocation = async () => {
    try {
      const resp = await fetch("https://ipapi.co/json");
      if (!resp.ok) throw new Error("IP lookup failed");
      const data = await resp.json();
      return { latitude: data.latitude, longitude: data.longitude };
    } catch (error) {
      console.error("IP geolocation error:", error);
      throw error;
    }
  };

  const handleShareLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    setSharingLocation(true);
    let coords = null;

    try {
      // Try low-accuracy first
      const pos1 = await getLocation({
        enableHighAccuracy: false,
        timeout: 7000,
        maximumAge: 10000,
      });
      coords = pos1.coords;
    } catch (err1) {
      console.warn("Low-accuracy failed. Trying high-accuracy:", err1.message);
      try {
        const pos2 = await getLocation({
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
        coords = pos2.coords;
      } catch (err2) {
        console.warn("High-accuracy failed. Trying IP fallback:", err2.message);
        try {
          coords = await getIPLocation();
        } catch (err3) {
          alert("Failed to get location: " + err3.message);
          setSharingLocation(false);
          return;
        }
      }
    }

    const mapsLink = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "🚨 Emergency",
          text: `I need help. Here's my location:\n${mapsLink}`,
        });
      } catch (err) {
        console.error("Sharing failed:", err.message);
      }
    } else {
      await navigator.clipboard.writeText(mapsLink);
      alert("Location copied to clipboard:\n" + mapsLink);
    }

    setSharingLocation(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-white text-3xl mb-6">SOS Location</h1>

      <button
        onClick={handleShareLocation}
        disabled={sharingLocation}
        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg font-semibold text-white transition-transform ${
          sharingLocation
            ? "bg-gray-600 opacity-60"
            : "bg-gradient-to-r from-red-600 to-red-800 hover:scale-105"
        }`}
      >
        {sharingLocation ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span>Fetching...</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 6.5C7.305 6.5 3.5 10.305 3.5 15S7.305 23.5 12 23.5 20.5 19.695 20.5 15 16.695 6.5 12 6.5z"
              />
            </svg>
            SOS
          </>
        )}
      </button>

      {sharingLocation && (
        <p className="text-sm text-white mt-2 animate-pulse">Retrieving location...</p>
      )}
    </div>
  );
};

export default Home;
