import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNgoProfileThunk } from "../store/slice/ngo/ngo.thunk";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import NGOPostCard from "../components/NGOPostCard";
import { nanoid } from "nanoid";
import { addPartner, setSelectedPartner } from "../store/slice/message/message.slice";

const NgoProfile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const loggedInUser = useSelector((state) => state.user.userProfile);

  // NGO data
  const [ngo, setNgo] = useState(null);
  const [loadingNgo, setLoadingNgo] = useState(true);

  // Posts pagination state
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Volunteer request
  const [requesting, setRequesting] = useState(false);
  const [requestMessage, setRequestMessage] = useState(null);

  // Fetch NGO profile
  useEffect(() => {
    const fetchNgo = async () => {
      try {
        setLoadingNgo(true);
        if (id) {
          const res = await axiosInstance.get(`/ngo/${id}`);
          setNgo(res.data.ngo);
        } else {
          const res = await dispatch(getNgoProfileThunk());
          if (res.payload) setNgo(res.payload);
        }
      } catch (err) {
        console.error("Failed to fetch NGO profile:", err);
      } finally {
        setLoadingNgo(false);
      }
    };
    fetchNgo();
  }, [dispatch, id]);

  // Fetch posts paginated for this NGO
  const fetchPosts = async (pageNum) => {
    if (!ngo) return;
    try {
      setLoadingPosts(true);
      const limit = 10;
      const res = await axiosInstance.get("/ngopost/", {
        params: {
          page: pageNum,
          limit,
          ngoId: ngo._id,
        },
      });
      // Append posts
      setPosts((prev) => [...prev, ...res.data.posts]);

      // If fewer posts than limit, no more data
      if (res.data.posts.length < limit) {
        setHasMorePosts(false);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Reset posts and fetch first page when NGO loads or changes
  useEffect(() => {
    if (ngo) {
      setPosts([]);
      setPage(1);
      setHasMorePosts(true);
      fetchPosts(1);
    }
  }, [ngo]);

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

  // Fetch posts for next pages when page changes
  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  // Volunteer request handler
  const handleRequestVolunteer = async () => {
    setRequesting(true);
    setRequestMessage(null);
    try {
      const response = await axiosInstance.post(
        `/auth/${ngo._id}/request-volunteer`
      );
      setRequestMessage(response.data.message || "Request sent successfully!");
      setNgo((prev) => ({
        ...prev,
        volunteersRequests: [...(prev.volunteersRequests || []), loggedInUser._id],
      }));
    } catch (error) {
      setRequestMessage(
        error.response?.data?.message || "Failed to send request. Please try again."
      );
    } finally {
      setRequesting(false);
    }
  };

  // Check if user already volunteer
  const isAlreadyVolunteer = ngo?.volunteers?.some(
    (v) => v._id === loggedInUser?._id || v === loggedInUser?._id
  );

  if (loadingNgo || !ngo) {
    return (
      <p className="text-center mt-10 text-gray-500">Loading NGO profile...</p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
      {/* NGO Header */}
      <div className="flex flex-col sm:flex-row gap-6 items-center border-b pb-6">
        {ngo.logoUrl ? (
          <img
            src={ngo.logoUrl}
            alt="NGO Logo"
            className="w-36 h-36 object-cover rounded-full border shadow"
          />
        ) : (
          <div className="w-36 h-36 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 border shadow">
            No Logo
          </div>
        )}

        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-semibold">{ngo.name}</h2>
          <p className="text-gray-600">{ngo.email}</p>
          <p className="text-sm text-gray-500">📞 {ngo.phone}</p>
          <p className="text-sm text-gray-500">📍 {ngo.address}</p>
          <p className="text-sm text-gray-500">🏢 Established: {ngo.establishedYear}</p>
          <p className="text-sm mt-2 text-gray-700">{ngo.description}</p>

          <div className="flex flex-wrap gap-4">
            {ngo.volunteers && ngo.volunteers.length > 0 && (
              <Link
                to={`/ngo/${ngo._id}/volunteers`}
                className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Volunteers
              </Link>
            )}

            <button
              onClick={() => {
                const partner = {
                  _id: ngo.createdBy._id,
                  name: ngo.name,
                  email: ngo.email,
                  profilepic: ngo.logoUrl || "", // Use logoUrl instead of profilepic
                };
                dispatch(addPartner(partner));
                dispatch(setSelectedPartner(partner));
                navigate(`/messages/${ngo.createdBy._id}`);
              }}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Message NGO
            </button>

            {loggedInUser && ngo?.createdBy?._id === loggedInUser._id && (
              <Link
                to={`/ngo/${ngo._id}/update`}
                className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Update Profile
              </Link>
            )}

            {loggedInUser && ngo?.createdBy?._id !== loggedInUser._id && (
              <>
                {isAlreadyVolunteer ? (
                  <p className="mt-4 text-green-600 font-medium">✅ You are a volunteer</p>
                ) : ngo.volunteersRequests?.includes(loggedInUser?._id) ? (
                  <p className="mt-4 text-yellow-600 font-medium">⏳ Volunteer request sent</p>
                ) : (
                  <>
                    <button
                      onClick={handleRequestVolunteer}
                      disabled={requesting}
                      className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                      {requesting ? "Requesting..." : "Request to Volunteer"}
                    </button>

                    {requestMessage && (
                      <p
                        className={`mt-2 ${
                          requestMessage.toLowerCase().includes("failed")
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {requestMessage}
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Only NGO owner sees this */}
      {loggedInUser && ngo?.createdBy?._id === loggedInUser._id && (
        <div className="flex flex-wrap gap-4 mt-4">
          <Link
            to={`/user-profile`}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            View My Profile
          </Link>

          <Link
            to={`/ngo/${ngo._id}/create-post`}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Create New Post
          </Link>
        </div>
      )}

      {/* Posts */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Posts</h3>

        {posts.length === 0 && !loadingPosts && (
          <p className="text-gray-500">No posts added yet.</p>
        )}

        <div className="flex flex-col gap-6 max-w-full overflow-x-hidden">
          {posts.map((post, index) => (
            <NGOPostCard
              key={post._id || nanoid()}
              post={post}
              currentUser={loggedInUser}
            />
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

export default NgoProfile;
