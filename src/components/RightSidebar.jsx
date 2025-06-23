import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getsuggestedUsersThunk } from '../store/slice/user/user.thunk.js';
import { useNavigate } from 'react-router-dom';

const RightSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { otherUsers: suggestedUsers, screenLoading: loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getsuggestedUsersThunk());
  }, [dispatch]);

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="hidden lg:flex w-64 h-screen bg-gray-800 text-white flex-col p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Suggested Users</h2>
      <div className="flex-grow overflow-y-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-4">
            {suggestedUsers?.length > 0 ? (
              suggestedUsers.map((user) => (
                <li
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className="flex items-center cursor-pointer hover:bg-gray-700 p-2 rounded transition"
                >
                  <img
                    src={user.profilepic || "https://via.placeholder.com/40"}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                </li>
              ))
            ) : (
              <p>No suggestions found.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
