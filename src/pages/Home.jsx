import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUserPostsThunk } from '../store/slice/userpost/userpost.thunk.js';
import { getAllNGOPostsThunk } from '../store/slice/ngopost/ngopost.thunk.js';
import UserPostCard from '../components/UserPostCard';
import NGOPostCard from '../components/NGOPostCard';



const Home = () => {
  const dispatch = useDispatch();
  const { userPosts, loading: userPostsLoading, error: userPostsError , hasMoreUserPosts} = useSelector(state => state.userpost);
  const { ngoposts: ngoPosts, getAllLoading: ngoPostsLoading, getAllError: ngoPostsError, hasMoreNGOPosts } = useSelector(state => state.ngopost);
  const { userProfile } = useSelector(state => state.user);

  const [page, setPage] = useState(1);

  const [lastFetchedPage, setLastFetchedPage] = useState(1);

  function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}


  useEffect(() => {
    // Load first page on mount
    dispatch(getAllUserPostsThunk({ page }));
    dispatch(getAllNGOPostsThunk({ page }));
  }, [dispatch, page]);

 
const handleScroll = useCallback(
  debounce(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.offsetHeight;

    if (
      scrollTop + windowHeight >= fullHeight - 100 &&
      lastFetchedPage === page &&
      hasMoreUserPosts &&
      hasMoreNGOPosts // only load if more data available
    ) {
      setPage(prev => {
        const nextPage = prev + 1;
        setLastFetchedPage(nextPage);
        return nextPage;
      });
    }
  }, 200),
  [page, lastFetchedPage, hasMoreUserPosts, hasMoreNGOPosts]
);
const handleShareLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;

      const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

      if (navigator.share) {
        navigator
          .share({
            title: "🚨 Emergency",
            text: `I need help. Here's my location:\n${mapsLink}`,
          })
          .then(() => console.log("Location shared successfully"))
          .catch(err => console.error("Error sharing location", err));
      } else {
        navigator.clipboard.writeText(mapsLink);
        alert("Location link copied to clipboard:\n" + mapsLink);
      }
    },
    error => {
      alert("Failed to fetch location: " + error.message);
    },
    {
      enableHighAccuracy: true,       // ✅ Force GPS on mobile
      timeout: 10000,                 // 10 seconds to wait
      maximumAge: 0                   // ✅ Don’t use cached location
    }
  );
};



  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (userPostsLoading || ngoPostsLoading) {
    return <div className="text-center text-white">Loading posts...</div>;
  }

  if (userPostsError || ngoPostsError) {
    return <div className="text-center text-red-500">Error loading posts: {userPostsError || ngoPostsError}</div>;
  }

  const uniqueNgoPosts = Array.from(
  new Map(ngoPosts.map(post => [post._id, post])).values()
);

const uniqueUserPosts = Array.from(
  new Map(userPosts.map(post => [post._id, post])).values()
);

const allPosts = [
  ...uniqueUserPosts.map(post => ({ ...post, type: 'user' })),
  ...uniqueNgoPosts.map(post => ({ ...post, type: 'ngo' })),
].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


return (
  <div className="w-full px-2 sm:px-4 pb-36 overflow-x-hidden">
    <h1 className="text-3xl font-bold text-white mb-4 sm:mb-6">Recent Posts</h1>

    <div className="flex flex-col gap-4 sm:gap-6">
      {allPosts.map(post =>
        post.type === 'user' ? (
          <UserPostCard key={`user-${post._id}`} post={post} currentUser={userProfile} />
        ) : (
          <NGOPostCard key={`ngo-${post._id}`} post={post} currentUser={userProfile} />
        )
      )}
    </div>

    {userProfile?.gender === "female" && userProfile?.femaleVerified && (
      <div className="fixed z-50 right-4 sm:right-6 bottom-16 sm:bottom-6">
        <button
          onClick={handleShareLocation}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
          title="Send Emergency Location"
        >
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
        </button>
      </div>
    )}
  </div>
);



};

export default Home;
