// src/chat/ChatPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageThunk, getMessageThunk } from "../store/slice/message/message.thunk";
import socket from "../socket";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { markMessagesSeen } from "../store/slice/message/message.slice";
import {axiosInstance} from "../utils/axiosInstance";
const ChatPage = ({ partner }) => {
  const dispatch = useDispatch();
 
  const { messages } = useSelector((state) => state.message);
  const user = useSelector((state) => state.user.userProfile);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
 const navigate = useNavigate();
  const chatPartnerId = partner?.isNgo ? partner.createdBy : partner._id;
  const chatMessages = messages[chatPartnerId] || [];


 useEffect(() => {
  if (chatPartnerId) {
    dispatch(getMessageThunk({ receiverId: chatPartnerId , page: 1, limit: 30}));
    
    // Mark messages as seen
    axiosInstance.post(`/message/seen/${chatPartnerId}`).catch(console.error);
  }
}, [chatPartnerId, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

 useEffect(() => {
  socket.on("receiveMessage", (newMessage) => {
  if (newMessage.sender === chatPartnerId || newMessage.receiverId === chatPartnerId) {
    dispatch(getMessageThunk({ receiverId: chatPartnerId }));

    // 🟢 Automatically mark as seen if chat is open
    axiosInstance.post(`/message/seen/${chatPartnerId}`).catch(console.error);
  }
});


    socket.on("typing", ({ from }) => {
      if (from === chatPartnerId) setIsTyping(true);
    });
    socket.on("stopTyping", ({ from }) => {
      if (from === chatPartnerId) setIsTyping(false);
    });
     socket.on("messageSeen", ({ receiverId }) => {
    // Agar current chat partner hai toh mark messages seen in redux store
    if (receiverId === chatPartnerId) {
      dispatch(markMessagesSeen(chatPartnerId)); 
      // Yeh action tumhe banana padega jo Redux state mein messages ke 'seen' ko update kare
    }
  });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
       socket.off("messageSeen");

    };
  }, [chatPartnerId, dispatch]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    socket.emit("stopTyping", { to: chatPartnerId, from: user._id });

    await dispatch(sendMessageThunk({ receiverId: chatPartnerId, message: text }));
    socket.emit("sendMessage", {
      sender: user._id,
      receiverId: chatPartnerId,
      message: text,
    });
    setText("");
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit("typing", { to: chatPartnerId, from: user._id });
    if (e.target.value === "") {
      socket.emit("stopTyping", { to: chatPartnerId, from: user._id });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-[80vh] flex flex-col">
      <div className="flex items-center gap-4 border-b pb-4 mb-4">
        <img
         onClick={() => navigate("/user/" + partner._id)}
          src={partner.profilepic || partner.logoUrl || "/default-avatar.png"}
          className="w-12 h-12 rounded-full"
          alt=""
        />
        <h2 className="text-xl font-semibold">{partner.name}</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 px-2">
      {chatMessages.map((msg, i) => {

  return (
    <div
      key={i}
      className={`p-3 rounded max-w-xs text-sm shadow-md relative whitespace-pre-wrap ${
        msg.senderId.toString() === user._id ? "ml-auto bg-blue-900" : "mr-auto bg-gray-900"
      }`}
    >
      <div>{msg.message}</div>
      <div className="text-[10px] text-gray-500 mt-1 text-right">
        {moment(msg.createdAt).format("hh:mm A")}
        {msg.senderId.toString() === user._id && (
          <span className="ml-1">{msg.seen ? "✓✓" : "✓"}</span>
        )}
      </div>
    </div>
  );
})}

        <div ref={bottomRef} />
      </div>

      {isTyping && (
        <div className="text-xs text-gray-500 italic mb-2 ml-2">{partner.name} is typing...</div>
      )}

      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={handleTyping}
          className="border p-2 rounded w-full"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;