import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const WhoAreYouPage = () => {
  const navigate = useNavigate();

  const [storedUser, setStoredUser] = useState(null);
  const userFromStore = useSelector((state) => state.user.userProfile);

  // Load user from localStorage once on mount
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('userProfile');
      if (rawUser && rawUser !== 'undefined') {
        setStoredUser(rawUser);  // store raw string, parse later
      }
    } catch (error) {
      console.error('Failed to parse userProfile from localStorage:', error);
    }
  }, []);

  // Helper to parse user safely
  const parseUser = (maybeString) => {
    if (!maybeString) return null;
    if (typeof maybeString === 'string') {
      try {
        return JSON.parse(maybeString);
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        return null;
      }
    }
    return maybeString;
  };

  // Parse Redux user or stored user safely
  const rawUser = userFromStore || storedUser;
  const userObject = parseUser(rawUser);

  // Find gender key ignoring case and spaces
  const genderKey = userObject
    ? Object.keys(userObject).find((key) => key.replace(/\s/g, '').toLowerCase() === 'gender')
    : null;

  const gender = genderKey ? userObject[genderKey] : '';

 

  const handleSelection = (choice) => {
    if (choice === 'organisation') {
      navigate('/create-organisation');
      return;
    }

    if (!gender) {
      alert('Gender not found. Please contact support or re-register.');
      return;
    }

    if (gender === 'male') {
      navigate('/');
    } else if (gender === 'female') {
      navigate('/female-verification');
    } else {
      alert(`Unsupported gender: "${gender}"`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Who Are You?</h2>

        <div className="grid gap-4">
          <button
            onClick={() => handleSelection('individual')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            I am an Individual
          </button>
          <button
            onClick={() => handleSelection('organisation')}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
          >
            I am an Organisation
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default WhoAreYouPage;
