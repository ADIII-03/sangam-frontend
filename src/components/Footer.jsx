import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiSearch, FiBell, FiMessageSquare, FiUser } from 'react-icons/fi';

const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-gray-800 text-white h-16 p-4">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        <Link to="/" className="flex flex-col items-center">
          <FiHome className="text-xl" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center">
          <FiSearch className="text-xl" />
          <span className="text-xs mt-1">Search</span>
        </Link>
        <Link to="/notifications" className="flex flex-col items-center">
          <FiBell className="text-xl" />
          <span className="text-xs mt-1">Notifications</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center">
          <FiUser className="text-xl" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Footer;