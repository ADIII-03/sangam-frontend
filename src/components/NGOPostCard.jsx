import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import {
  likeNGOPostThunk,
  shareNGOPostThunk,
  flagNGOPostThunk,
  commentOnNGOPostThunk,
  getWhoCommentedOnNGOPostThunk,
} from "../store/slice/ngopost/ngopost.thunk.js";
import { formatDistanceToNow } from "date-fns";
import Comment from "./Comment";
import socket from "../socket.js";

const NGOPostCard = ({ post, currentUser }) => {
  const dispatch = useDispatch();

  const [localPost, setLocalPost] = useState(() => ({
    ...post,
    likes: Array.isArray(post?.likes) ? post.likes : [],
    sharedBy: Array.isArray(post?.sharedBy) ? post.sharedBy : [],
    comments: Array.isArray(post?.comments) ? post.comments : [],
  }));

  useEffect(() => {
    if (post) {
      setLocalPost({
        ...post,
        likes: Array.isArray(post.likes) ? post.likes : [],
        sharedBy: Array.isArray(post.sharedBy) ? post.sharedBy : [],
        comments: Array.isArray(post.comments) ? post.comments : [],
      });
    }
  }, [post]);

  const postIdRef = useRef(localPost._id);
  useEffect(() => {
    postIdRef.current = localPost._id;
  }, [localPost._id]);

  useEffect(() => {
    const handleReceiveComment = (comment) => {
      if (comment.postId === postIdRef.current) {
        setLocalPost((prev) => ({
          ...prev,
          comments: [...prev.comments, comment],
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
            likes: [...prev.likes, { id: like.userId, actorModel: like.actorModel }],
          };
        });
      }
    };

    const handlePostUnliked = (like) => {
      if (like.postId === postIdRef.current) {
        setLocalPost((prev) => ({
          ...prev,
          likes: (prev.likes || []).filter(
            (l) => !(l.id === like.userId && l.actorModel === like.actorModel)
          ),
        }));
      }
    };

    socket.on("receiveComment", handleReceiveComment);
    socket.on("receiveLike", handleReceiveLike);
    socket.on("postUnliked", handlePostUnliked);

    return () => {
      socket.off("receiveComment", handleReceiveComment);
      socket.off("receiveLike", handleReceiveLike);
      socket.off("postUnliked", handlePostUnliked);
    };
  }, []);

  const [commentersMap, setCommentersMap] = useState({});
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    async function fetchCommenters() {
      if (!localPost._id) return;
      const resultAction = await dispatch(getWhoCommentedOnNGOPostThunk(localPost._id));
      if (getWhoCommentedOnNGOPostThunk.fulfilled.match(resultAction)) {
        const map = {};
        resultAction.payload.commenters.forEach((user) => {
          map[user._id] = user;
        });
        setCommentersMap(map);
      }
    }
    fetchCommenters();
  }, [localPost._id, dispatch]);

  const handleLike = async () => {
    try {
      const wasLiked = localPost.likes?.some(
        (like) =>
          like.id === currentUser._id &&
          like.actorModel === (currentUser.isNGO ? "NGO" : "User")
      );

      setLocalPost((prev) => {
        const newLikes = wasLiked
          ? prev.likes.filter(
              (like) =>
                !(
                  like.id === currentUser._id &&
                  like.actorModel === (currentUser.isNGO ? "NGO" : "User")
                )
            )
          : [
              ...prev.likes,
              {
                id: currentUser._id,
                actorModel: currentUser.isNGO ? "NGO" : "User",
              },
            ];

        return { ...prev, likes: newLikes };
      });

      socket.emit(wasLiked ? "postUnliked" : "newLike", {
        userId: currentUser._id,
        postId: localPost._id,
        actorModel: currentUser.isNGO ? "NGO" : "User",
      });

      if (localPost.ngo?._id && localPost.ngo._id !== currentUser._id && !wasLiked) {
        socket.emit("sendNotification", {
          type: "like",
          senderId: currentUser._id,
          receiverId: localPost.ngo._id,
          message: `${currentUser.name || "Someone"} liked your post`,
          postId: localPost._id,
        });
      }

      const updatedPost = await dispatch(likeNGOPostThunk(localPost._id));
      if (updatedPost?.payload?.post?.likes) {
        setLocalPost((prev) => ({
          ...prev,
          likes: updatedPost.payload.post.likes,
        }));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleShare = async () => {
    try {
      const updatedPost = await dispatch(shareNGOPostThunk(localPost._id));
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
      dispatch(flagNGOPostThunk({ postId: localPost._id, reason })).catch((error) => {
        console.error("Error flagging post:", error);
      });
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const text = commentInput.trim();
    if (text) {
      try {
        const updatedPost = await dispatch(
          commentOnNGOPostThunk({ postId: localPost._id, comment: text })
        );
        if (updatedPost?.payload) {
          setLocalPost(updatedPost.payload.post);
          setCommentInput("");

          socket.emit("newComment", {
            ...updatedPost.payload.post.comments.slice(-1)[0],
            postId: localPost._id,
          });

          if (localPost.ngo?._id && localPost.ngo._id !== currentUser._id) {
            socket.emit("sendNotification", {
              type: "comment",
              senderId: currentUser._id,
              receiverId: localPost.ngo._id,
              message: `${currentUser.name || "Someone"} commented on your post`,
              postId: localPost._id,
            });
          }
        }
      } catch (error) {
        console.error("Error commenting on post:", error);
      }
    }
  };

  if (!post) return null;

  const isLiked = !!(
    currentUser?._id &&
    localPost.likes?.some(
      (like) =>
        like.id === currentUser._id &&
        like.actorModel === (currentUser.isNGO ? "NGO" : "User")
    )
  );

  const ngoName = localPost.ngo?.name || "Anonymous NGO";
  const ngologo = localPost.ngo?.logoUrl || "/default-ngo-logo.png";

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-full w-full mx-auto mb-8 border border-gray-200 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center p-3 sm:p-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-semibold text-gray-600 mr-4 flex-shrink-0">
          <img
            src={ngologo}
            alt=""
            loading="lazy"
            className="w-10 h-10 rounded-full border-2 border-blue-400"
          />
        </div>
        <div className="truncate">
          <h3 className="font-semibold text-gray-900 truncate">{ngoName}</h3>
          <p className="text-xs text-gray-500 truncate">
            {localPost.createdAt && !isNaN(new Date(localPost.createdAt).getTime())
              ? `${formatDistanceToNow(new Date(localPost.createdAt))} ago`
              : "Invalid date"}
          </p>
        </div>
      </div>

      {/* Media */}
      <div className="rounded-b-xl">
        {localPost.mediaType === "image" && localPost.mediaUrl && (
          <img
            src={localPost.mediaUrl}
            alt="Post media"
            className="w-full max-w-full object-cover"
            loading="lazy"
          />
        )}

        {localPost.mediaType === "video" && localPost.mediaUrl && (
          <video controls className="w-full max-w-full object-cover" preload="metadata">
            <source src={localPost.mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Caption & Category */}
      <div className="p-3 sm:p-4">
        {localPost.caption && (
          <p className="text-gray-800 mb-2 whitespace-pre-wrap">{localPost.caption}</p>
        )}
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
          className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-950"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!commentInput.trim()}
          className="ml-3 bg-blue-600 disabled:bg-blue-300 rounded-full px-5 py-2 text-sm font-semibold transition-colors hover:bg-blue-700 disabled:cursor-not-allowed"
        >
          Post
        </button>
      </form>

      {/* Comments */}
      <div className="px-4 pb-4">
        {localPost.comments?.length > 0 && (
          <>
            {[...localPost.comments]
              .slice()
              .reverse()
              .slice(0, showAllComments ? undefined : 3)
              .map((comment, index) => (
                <div
                  key={`${localPost._id}-${
                    comment._id || comment.id || `${comment.author}-${comment.createdAt}-${index}`
                  }`}
                  className="border-b border-gray-100 py-2 last:border-none"
                >
                  <Comment
                    comment={comment}
                    commenter={
                      typeof comment.author === "object"
                        ? comment.author
                        : commentersMap[comment.author]
                    }
                  />
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

NGOPostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    ngo: PropTypes.shape({
      name: PropTypes.string,
      logoUrl: PropTypes.string,
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
        _id: PropTypes.string.isRequired,
        text: PropTypes.string,
        author: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
        createdAt: PropTypes.string,
      })
    ),
  }).isRequired,
  currentUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    isNGO: PropTypes.bool,
  }).isRequired,
};

export default NGOPostCard;
