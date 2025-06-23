import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Added useSelector
import { logoutUserThunk } from '../store/slice/user/user.thunk.js';
import { toast } from 'react-hot-toast';
import { FiHome, FiSearch, FiMessageSquare, FiBell, FiPlusSquare, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await dispatch(logoutUserThunk()).unwrap();
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to logout.');
    }
  };
  
  return (
    <div className="hidden md:flex w-64 h-screen bg-gray-800 text-white flex-col p-4 shadow-lg">
      <div className="flex items-center justify-center mb-8 gap-1">
        {/* App Logo */}
        <img src="/logo.png" alt="App Logo" className="w-10 h-10 p-1 rounded-2xl" />
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 bg-clip-text text-transparent">SANGAM</span>
      </div>
      <nav className="flex-grow">
        <ul>
          <li className="mb-4">
            <Link to="/" className="flex items-center text-lg hover:text-blue-400 transition-colors duration-200">
              <FiHome className="mr-3 text-xl" />
              Home
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/search" className="flex items-center text-lg hover:text-blue-400 transition-colors duration-200">
              <FiSearch className="mr-3 text-xl" />
              Search
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/messages" className="flex items-center text-lg hover:text-blue-400 transition-colors duration-200">
              <FiMessageSquare className="mr-3 text-xl" />
              Messages
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/notifications" className="flex items-center text-lg hover:text-blue-400 transition-colors duration-200">
              <FiBell className="mr-3 text-xl" />
              Notifications
            </Link>
          </li>

    
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center justify-center w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
      >
        <FiLogOut className="mr-3 text-xl" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
