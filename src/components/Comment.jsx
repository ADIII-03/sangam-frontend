import React from "react";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";

const Comment = ({ comment, commenter }) => (
  
  <div className="flex items-start gap-3 border-b border-gray-100 py-2 last:border-none">
    <img
      src={commenter?.profilepic || "/default-profile-pic.png"}
      alt={commenter?.name || "Anonymous"}
      className="w-8 h-8 rounded-full object-cover"
    />
    <div>
      <p className="text-sm text-gray-950">
        <span className="font-semibold">{commenter?.name || "Anonymous"}</span>{" "}
        {comment.text}
      </p>
      <p className="text-xs text-gray-950">
        {comment.createdAt
          ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
          : ""}
      </p>
    </div>
  </div>
);

Comment.propTypes = {
  comment: PropTypes.shape({
    text: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
  commenter: PropTypes.shape({
    name: PropTypes.string,
    profilepic: PropTypes.string,
  }),
};

export default Comment;
