import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiMessageSquare } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUserThunk } from '../store/slice/user/user.thunk';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.user.userProfile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogRef = useRef();
  const profileRef = useRef();

 if (!userProfile || typeof userProfile !== 'object') return null;


  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsDialogOpen(false);
      }
    }
    if (isDialogOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDialogOpen]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUserThunk()).unwrap();
      setIsDialogOpen(false);
      navigate('/login');
    } catch (error) {
      alert(error.message || 'Failed to logout.');
    }
  };

  return (
    <header className="w-full bg-gray-900 p-4 flex justify-between items-center shadow-md relative z-50">
      {/* Left side: Logo and App Name (only on small screens) */}
      <div className="flex items-center md:hidden">
        <img src="/logo.png" alt="App Logo" className="w-8 h-8 rounded-2xl" />
        <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 bg-clip-text text-transparent">
          SANGAM
        </span>
      </div>

      {/* Right side: Desktop profile link (no dropdown) */}
      <div className="hidden md:flex items-center" ref={profileRef}>
        <Link to="/profile" className="flex items-center space-x-3 text-white">
          <img
            src={userProfile.profilepic?.trim() ? userProfile.profilepic : '/default-profile.png'}

            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-blue-400"
            onError={(e) => {
              e.target.src = '/default-profile.png';
            }}
          />
          <span className="font-medium">{userProfile.name}</span>
        </Link>
      </div>

      {/* Mobile right side: Messages icon and dropdown profile */}
      <div className="flex items-center gap-4 md:hidden relative">
        <Link to="/messages" className="text-white">
          <FiMessageSquare className="text-xl" />
        </Link>
        <img
src={userProfile.profilepic?.trim() ? userProfile.profilepic : '/default-profile.png'}

          alt="Profile"
          className="w-8 h-8 rounded-full border-2 border-blue-400 cursor-pointer"
          onClick={() => setIsDialogOpen((prev) => !prev)}
          onError={(e) => {
            e.target.src = '/default-profile.png';
          }}
          ref={profileRef}
        />

        {isDialogOpen && (
          <div
            ref={dialogRef}
            className="absolute right-0 mt-12 w-48 bg-white rounded shadow-lg z-50"
            style={{ minWidth: 180 }}
          >
            <Link
              to="/profile"
              className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
              onClick={() => setIsDialogOpen(false)}
            >
              View My Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
