import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPartners, getMessageThunk } from "../store/slice/message/message.thunk";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import socket from "../socket";
import { addMessage } from "../store/slice/message/message.slice";

const AllChats = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { partners, messages } = useSelector((state) => state.message);
  const currentUser = useSelector((state) => state.user.userProfile);

  useEffect(() => {
    if (currentUser?._id) {
      // Fetch partners first
      dispatch(getPartners(currentUser._id)).then((action) => {
        // After partners loaded, fetch messages for each partner
        const partnersList = action.payload?.partners || [];
        partnersList.forEach((partner) => {
          const chatPartnerId = partner.isNgo ? partner.createdBy : partner._id;
          dispatch(getMessageThunk({ receiverId: chatPartnerId }));
        });
      });

      // Join socket room for current user
      socket.emit("joinUserRoom", currentUser._id.toString());
    }
  }, [dispatch, currentUser]);

  // Listen for new incoming messages on socket
  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      dispatch(addMessage(newMessage));
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [dispatch]);

  const getChatPartnerId = (partner) => (partner?.isNgo ? partner.createdBy : partner._id);

  const getLastMessage = (partnerId) => {
    const chatMsgs = messages[partnerId] || [];
    return chatMsgs.length > 0 ? chatMsgs[chatMsgs.length - 1] : null;
  };

  const sortedPartners = [...partners].sort((a, b) => {
  const aId = getChatPartnerId(a);
  const bId = getChatPartnerId(b);

  const aLastMsg = getLastMessage(aId);
  const bLastMsg = getLastMessage(bId);

  const aTime = aLastMsg ? new Date(aLastMsg.createdAt).getTime() : 0;
  const bTime = bLastMsg ? new Date(bLastMsg.createdAt).getTime() : 0;

  // Sort descending (most recent first)
  return bTime - aTime;
});


  return (
    <div
      className="bg-gray-900 text-white h-screen
      w-full sm:w-80
      overflow-y-auto
      border-r border-gray-700 p-4
      flex flex-col"
    >
      <h2 className="text-xl font-bold mb-4 sm:text-left text-center">Chats</h2>

      {sortedPartners.length === 0 ? (
        <p className="text-gray-500 text-center">No chats yet.</p>
      ) : (
        <ul className="space-y-2 flex-1">
          {sortedPartners.map((partner) => {
            const chatPartnerId = getChatPartnerId(partner);
            const lastMsg = getLastMessage(chatPartnerId);
            const isUnread =
              lastMsg && !lastMsg.seen && lastMsg.senderId !== currentUser._id;

            return (
              <li
                key={partner._id}
                onClick={() => navigate(`/messages/${partner._id}`)}
                className="cursor-pointer flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition"
              >
                <img
                  src={partner.profilepic || partner.logoUrl || "/default-avatar.png"}
                  alt={partner.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium truncate">{partner.name}</h4>
                    {lastMsg && (
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {moment(lastMsg.createdAt).format("hh:mm A")}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400 truncate">
                      {lastMsg ? lastMsg.message : "Start a conversation"}
                    </p>
                    {isUnread && (
                      <span className="ml-2 bg-blue-500 text-white rounded-full px-2 text-xs">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AllChats;
