import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserPostCard from "../components/UserPostCard";
import { useDispatch } from "react-redux";
import { addPartner , setSelectedPartner } from "../store/slice/message/message.slice";
const UserProfile = () => {
  const { id } = useParams();
  const { userProfile } = useSelector((state) => state.user); // fallback

  const userId = id || userProfile?._id;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // NGO details for volunteeredAt
  const [ngos, setNgos] = useState([]);

  // Posts pagination state
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const dispatch = useDispatch();

const goToChat = () => {
  if (!user) return;

  // Add to partners list if not already there
  dispatch(addPartner(user));

  // Set selected partner for chat container
  dispatch(setSelectedPartner(user));

  // Navigate to messages route
  navigate(`/messages/${user._id}`);
};

  // Fetch user + NGO info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) return;
        setLoadingUser(true);
        const res = await axiosInstance.get(`/auth/user/${userId}`);
        setUser(res.data.user);

        // Fetch NGO details for volunteeredAt
        const ngoIds = res.data.user.volunteeredAt || [];
        const ngoRequests = ngoIds.map((ngoId) =>
          axiosInstance.get(`/ngo/${ngoId}`)
        );
        const ngoResponses = await Promise.all(ngoRequests);
        setNgos(ngoResponses.map((r) => r.data.ngo));
      } catch (err) {
        console.error("Failed to fetch user or NGO data:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [userId]);

  // Fetch posts paginated for this user
  const fetchPosts = async (pageNum) => {
    if (!userId) return;
    try {
      setLoadingPosts(true);
      const limit = 10;
      const res = await axiosInstance.get("/userpost/", {
        params: {
          page: pageNum,
          limit,
          userId,
        },
      });
      setPosts((prev) => [...prev, ...res.data.posts]);

      if (res.data.posts.length < limit) {
        setHasMorePosts(false);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Reset posts and fetch first page when user changes
  useEffect(() => {
    if (userId) {
      setPosts([]);
      setPage(1);
      setHasMorePosts(true);
      fetchPosts(1);
    }
  }, [userId]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100 &&
      hasMorePosts &&
      !loadingPosts
    ) {
      setPage((prev) => prev + 1);
    }
  }, [hasMorePosts, loadingPosts]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Fetch posts for subsequent pages when page changes
  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  if (loadingUser || !user) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  const uniquePosts = posts.filter((post, index, self) =>
  index === self.findIndex((p) => p._id === post._id)
);


  return (
    <div className="max-w-screen-sm sm:max-w-4xl mx-auto px-4 sm:px-6 overflow-x-hidden">

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b pb-6">
       <img
  src={user.profilepic}
  alt="Profile"
  className="w-24 h-24 sm:w-36 sm:h-36 rounded-full object-cover border shadow"
/>

        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-500 capitalize mt-1">Gender: {user.gender}</p>
          <p className="text-sm text-green-600 mt-1">
            {user.isVerified ? "✅ Verified" : "❌ Not Verified"}
          </p>
        </div>
       

        {userProfile?._id !== user._id && (
          <button
            onClick={goToChat}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-950 transition"
          >
            Message
          </button>
        )}

        {userProfile?._id === user._id && (
          <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
            <Link
              to={`/user/update/${user._id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Update Profile
            </Link>
            <Link
              to={`/user/${user._id}/create-post`}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Create Post
            </Link>
          </div>
        )}
      </div>

      {/* Volunteered At */}
      {ngos.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-medium mb-4">Volunteered At</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {ngos.map((ngo) => (
              <Link
                to={`/ngo/${ngo._id}`}
                key={ngo._id}
                className="flex flex-col items-center border rounded-md p-4 hover:shadow transition"
              >
                <img
                  src={ngo.logoUrl}
                  alt={ngo.name}
                  className="w-16 h-16 object-cover rounded-full mb-2"
                />
                <p className="text-sm font-medium text-gray-700 text-center">
                  {ngo.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Posts Section */}
      <div className="mt-10">
        <h3 className="text-xl font-medium mb-4">Posts</h3>

        {uniquePosts.length === 0 && !loadingPosts && (
          <p className="text-gray-500">No posts yet.</p>
        )}

      <div className="flex flex-col gap-4 sm:gap-6 overflow-x-hidden">
  {uniquePosts.map((post) => (
    <UserPostCard key={post._id} post={post} currentUser={userProfile} />
  ))}
</div>


        {loadingPosts && (
          <p className="mt-4 text-center text-gray-500">Loading more posts...</p>
        )}

        {!hasMorePosts && posts.length > 0 && (
          <p className="mt-4 text-center text-gray-500">No more posts.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
