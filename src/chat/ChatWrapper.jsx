import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUserAndAddToPartners } from "../store/slice/message/message.thunk";
import ChatPage from "./ChatPage";

const ChatWrapper = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const partner = useSelector((state) =>
    state.message.partners.find((p) => p._id === id)
  );

  useEffect(() => {
    if (id && !partner) {
      dispatch(fetchUserAndAddToPartners(id));
    }
  }, [id, partner, dispatch]);

  if (!partner) {
    return <p className="text-center mt-10 text-gray-500">Loading chat...</p>;
  }

  return <ChatPage partner={partner} />;
};

export default ChatWrapper;
