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
const [sharingLocation, setSharingLocation] = useState(false);

const handleShareLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  setSharingLocation(true); // show loader

  const successHandler = position => {
    const { latitude, longitude } = position.coords;
    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    if (navigator.share) {
      navigator
        .share({
          title: "🚨 Emergency",
          text: `I need help. Here's my location:\n${mapsLink}`,
        })
        .catch(err => console.error("Error sharing location", err));
    } else {
      navigator.clipboard.writeText(mapsLink);
      alert("Location link copied to clipboard:\n" + mapsLink);
    }

    setSharingLocation(false); // hide loader
  };

  const errorHandler = error => {
    if (error.code === error.TIMEOUT) {
      // Retry without high accuracy
      navigator.geolocation.getCurrentPosition(
        successHandler,
        finalError => {
          alert("Failed to fetch location: " + finalError.message);
          setSharingLocation(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Failed to fetch location: " + error.message);
      setSharingLocation(false);
    }
  };

  navigator.geolocation.getCurrentPosition(
    successHandler,
    errorHandler,
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
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
  <div className="w-full px-1 sm:px-2 pb-36 overflow-x-hidden">
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
  disabled={sharingLocation}
  className={`flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold px-4 py-3 rounded-full shadow-lg transition-transform duration-300 ${
    sharingLocation ? "opacity-60 cursor-not-allowed" : "hover:scale-105"
  }`}
  title="Send Emergency Location"
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

      </div>
    )}
  </div>
);



};

export default Home;
