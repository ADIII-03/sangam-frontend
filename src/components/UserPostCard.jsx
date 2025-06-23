import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import {
  likeUserPostThunk,
  shareUserPostThunk,
  flagUserPostThunk,
  commentOnUserPostThunk,
  getWhoCommentedOnUserPostThunk,
} from "../store/slice/userpost/userpost.thunk.js";
import { formatDistanceToNow } from "date-fns";
import Comment from "./Comment";
import socket from "../socket.js";

const UserPostCard = ({ post, currentUser }) => {
  const dispatch = useDispatch();

  const [localPost, setLocalPost] = useState(() => ({
    ...post,
    likes: Array.isArray(post.likes) ? post.likes : [],
    sharedBy: Array.isArray(post.sharedBy) ? post.sharedBy : [],
    comments: Array.isArray(post.comments) ? post.comments : [],
  }));
  const [commentersMap, setCommentersMap] = useState({});

  useEffect(() => {
    async function fetchCommenters() {
      if (!localPost._id) return;
      const resultAction = await dispatch(
        getWhoCommentedOnUserPostThunk(localPost._id)
      );
      if (getWhoCommentedOnUserPostThunk.fulfilled.match(resultAction)) {
        // create a map from commenter id to their info for quick lookup
        const map = {};
        resultAction.payload.commenters.forEach((user) => {
          map[user.id] = user;
        });
        setCommentersMap(map);
      }
    }
    fetchCommenters();
  }, [localPost._id, dispatch]);

  const [showAllComments, setShowAllComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  const postIdRef = useRef(localPost._id);
  useEffect(() => {
    postIdRef.current = localPost._id;
  }, [localPost._id]);

  useEffect(() => {
    const handleReceiveComment = (comment) => {
      // Check if comment is for current post
      if (comment.postId === postIdRef.current) {
        setLocalPost((prev) => ({
          ...prev,
          comments: [...(prev.comments || []), comment],
        }));
      }
    };

    const handleReceiveLike = (like) => {
      if (like.postId === postIdRef.current) {
        setLocalPost((prev) => {
          const alreadyLiked = prev.likes.some(
            (l) => l.id === like.userId && l.actorModel === like.actorModel
          );
          if (alreadyLiked) return prev;

          return {
            ...prev,
            likes: [...(prev.likes || []), { id: like.userId, actorModel: like.actorModel }],
          };
        });
      }
    };

    const handleReceiveUnlike = (unlike) => {
      if (unlike.postId === postIdRef.current) {
        setLocalPost((prev) => ({
          ...prev,
          likes: (prev.likes || []).filter(
            (l) => !(l.id === unlike.userId && l.actorModel === unlike.actorModel)
          ),
        }));
      }
    };

    socket.on("receiveComment", handleReceiveComment);
    socket.on("receiveLike", handleReceiveLike);
    socket.on("postUnliked", handleReceiveUnlike);
    return () => {
      socket.off("receiveComment", handleReceiveComment);
      socket.off("receiveLike", handleReceiveLike);
      socket.off("postUnliked", handleReceiveUnlike);
    };
  }, []);

  const handleLike = async () => {
    try {
      const actorModel = currentUser.isNGO ? "NGO" : "User";

      const wasLiked = localPost.likes?.some(
        (like) => like.id === currentUser._id && like.actorModel === actorModel
      );

      // ✅ Optimistic UI update
      setLocalPost((prev) => {
        const updatedLikes = wasLiked
          ? prev.likes.filter(
              (like) =>
                !(
                  like.id === currentUser._id &&
                  like.actorModel === actorModel
                )
            )
          : [...prev.likes, { id: currentUser._id, actorModel }];

        return {
          ...prev,
          likes: updatedLikes,
        };
      });

      // 🔁 Dispatch thunk — only update likes if backend sends different result
      const updatedPost = await dispatch(likeUserPostThunk(localPost._id));
      const newPost = updatedPost?.payload?.post;
      if (newPost?.likes) {
        setLocalPost((prev) => ({ ...prev, likes: newPost.likes }));
      }

      // ✅ Emit socket
      socket.emit(wasLiked ? "postUnliked" : "newLike", {
        userId: currentUser._id,
        postId: localPost._id,
        actorModel,
      });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleShare = async () => {
    try {
      const updatedPost = await dispatch(shareUserPostThunk(localPost._id));
      if (updatedPost?.payload) {
        setLocalPost(updatedPost.payload.post);
      }
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

  const handleFlag = () => {
    const reason = prompt("Enter reason for flagging this post:");
    if (reason) {
      dispatch(flagUserPostThunk({ postId: localPost._id, reason })).catch((error) => {
        console.error("Error flagging post:", error);
      });
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const comment = commentInput.trim();
    if (comment) {
      try {
        const updatedPost = await dispatch(
          commentOnUserPostThunk({ postId: localPost._id, comment })
        );
        if (updatedPost?.payload) {
          setLocalPost(updatedPost.payload.post);
          setCommentInput("");
          const newComment = updatedPost.payload.post.comments.slice(-1)[0]; // last comment
          socket.emit("newComment", { ...newComment, postId: localPost._id });
        }
      } catch (error) {
        console.error("Error commenting on post:", error);
      }
    }
  };

  const isLiked = !!(
    currentUser?._id &&
    localPost.likes?.some(
      (like) =>
        like.id === currentUser._id &&
        like.actorModel === (currentUser.isNGO ? "NGO" : "User")
    )
  );

  const creatorName =
    localPost.createdBy?.name || localPost.createdBy?.id?.name || "Anonymous";

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-xl w-full mx-auto mb-8 border border-gray-200 px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-100">
        {/* Profile pic placeholder */}
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-semibold text-gray-600 mr-4">
          <img
            src={localPost.createdBy?.id?.profilepic}
            alt=""
            className="w-10 h-10 rounded-full border-2 border-blue-400"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{creatorName}</h3>
          {localPost.location?.address && (
            <p className="text-xs text-gray-500 italic">📍 {localPost.location.address}</p>
          )}
          <p className="text-xs text-gray-500">
            {localPost.createdAt && !isNaN(new Date(localPost.createdAt).getTime())
              ? `${formatDistanceToNow(new Date(localPost.createdAt))} ago`
              : "Invalid date"}
          </p>
        </div>
      </div>

      {/* Media */}
      <div className="max-h-[400px] overflow-hidden rounded-b-xl">
        {localPost.mediaType === "image" && localPost.mediaUrl && (
          <img
            src={localPost.mediaUrl}
            alt="Post media"
            className="w-full object-cover"
            loading="lazy"
          />
        )}

        {localPost.mediaType === "video" && localPost.mediaUrl && (
          <video controls className="w-full object-contain" preload="metadata">
            <source src={localPost.mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Caption & Category */}
      <div className="p-4">
        {localPost.caption && (
          <p className="text-gray-800 mb-2 whitespace-pre-wrap">{localPost.caption}</p>
        )}
        <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full capitalize">
          {localPost.category || "Other"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-around border-t border-gray-100 px-4 py-3 text-gray-700 text-sm select-none">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors ${
            isLiked ? "text-red-500" : "hover:text-red-400"
          }`}
          aria-label="Like post"
        >
          <span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
          <span>{Math.max(localPost.likes?.length || 0, 0)}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 hover:text-green-600 transition-colors"
          aria-label="Share post"
        >
          <span className="text-lg">🔄</span>
          <span>{localPost.sharedBy?.length || 0}</span>
        </button>

        <button
          onClick={handleFlag}
          className="flex items-center gap-2 hover:text-red-600 transition-colors"
          aria-label="Flag post"
        >
          <span className="text-lg">🚩</span>
          <span>Flag</span>
        </button>
      </div>

      {/* Comment input */}
      <form
        onSubmit={handleComment}
        className="flex items-center border-t border-gray-100 px-4 py-3"
      >
        <input
          type="text"
          name="comment"
          placeholder="Add a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!commentInput.trim()}
          className="ml-3 bg-blue-600 disabled:bg-blue-300 text-white rounded-full px-5 py-2 text-sm font-semibold transition-colors hover:bg-blue-700 disabled:cursor-not-allowed"
        >
          Post
        </button>
      </form>

      {/* Comments */}
      <div className="px-4 pb-4">
        {localPost.comments?.length > 0 && (
          <>
            {[...localPost.comments]
              .reverse()
              .slice(0, showAllComments ? undefined : 3)
              .map((comment) => (
                <div
                  key={comment._id || comment.id || Math.random().toString()}
                  className="border-b border-gray-100 py-2 last:border-none"
                >
                  <Comment comment={comment} commenter={commentersMap[comment.id]} />
                </div>
              ))}

            {localPost.comments.length > 3 && (
              <button
                onClick={() => setShowAllComments(!showAllComments)}
                className="mt-2 text-blue-600 text-sm font-semibold hover:underline"
                aria-label="Toggle show all comments"
              >
                {showAllComments
                  ? "Hide comments"
                  : `View all ${localPost.comments.length} comments`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

UserPostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    createdBy: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.shape({ name: PropTypes.string }),
      logo: PropTypes.string,
      profilepic: PropTypes.string,
    }),
    createdAt: PropTypes.string,
    category: PropTypes.string,
    caption: PropTypes.string,
    mediaUrl: PropTypes.string,
    mediaType: PropTypes.string,
    likes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        actorModel: PropTypes.string,
      })
    ),
    sharedBy: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        actorModel: PropTypes.string,
      })
    ),

    comments: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        id: PropTypes.string,
        actorModel: PropTypes.string,
        text: PropTypes.string.isRequired,
      })
    ),
    location: PropTypes.shape({
      address: PropTypes.string,
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }),
  }).isRequired,
  currentUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    isNGO: PropTypes.bool,
  }).isRequired,
};

export default UserPostCard;
