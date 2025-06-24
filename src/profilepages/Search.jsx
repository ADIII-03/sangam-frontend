import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { searchUsers } from '../store/slice/user/user.thunk';
import { useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import {Helmet} from 'react-helmet';
const Search = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState(() => {
    const stored = localStorage.getItem('search-history');
    return stored ? JSON.parse(stored) : [];
  });

  const { otherUsers = [], screenLoading } = useSelector((state) => state.user);

  useEffect(() => {
  if (query.trim().length === 0) {
   
    return;
  };

  const delay = setTimeout(() => {
    dispatch(searchUsers(query));
    const updatedHistory = [query, ...searchHistory.filter(q => q !== query)].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem('search-history', JSON.stringify(updatedHistory));
  }, 1000);

  return () => clearTimeout(delay);
}, [query]);


  const handleRedirect = (account) => {
    if (account.type === 'ngo') {
      navigate(`/ngo/${account._id}`);
    } else if (account.type === 'user') {
      navigate(`/user/${account._id}`);
    }
  };

  const handleHistoryClick = (term) => {
    setQuery(term);
  };

  const handleDeleteHistoryItem = (index) => {
    const updated = [...searchHistory];
    updated.splice(index, 1);
    setSearchHistory(updated);
    localStorage.setItem('search-history', JSON.stringify(updated));
  };

  const handleClearAllHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('search-history');
  };

  return (

    <>
    <Helmet>
      <title>Search-Sangam</title>
    </Helmet>
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Search Accounts</h2>

      <input
        type="text"
        placeholder="Search by name..."
        className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query.trim() === '' && searchHistory.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Recent Searches:</h4>
            <button
              onClick={handleClearAllHistory}
              className="text-sm text-red-500 hover:underline"
            >
              Clear All
            </button>
          </div>
          <ul className="space-y-2">
            {searchHistory.map((term, i) => (
              <li key={i} className="flex justify-between items-center">
                <span
                  onClick={() => handleHistoryClick(term)}
                  className="cursor-pointer text-blue-600 hover:underline"
                >
                  {term}
                </span>
                <button
                  onClick={() => handleDeleteHistoryItem(i)}
                  className="text-gray-400 hover:text-red-500"
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {screenLoading && <p>Loading...</p>}

      {!screenLoading && query.trim() && otherUsers?.length === 0 && (
        <p>No users or NGOs found for "{query}"</p>
      )}

      {!screenLoading && query.trim() && (
        <div className="grid gap-4">
          {otherUsers.map((acc) => (
            <div
              key={acc._id}
              onClick={() => handleRedirect(acc)}
              className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg shadow hover:bg-gray-900 cursor-pointer transition"
            >
              <img
                src={acc.profilepic || acc.logoUrl || '/default.png'}
                alt={acc.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-lg font-semibold">{acc.name}</p>
                <p className="text-sm text-gray-500 capitalize">{acc.type}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default Search;
