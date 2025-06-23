import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotificationsThunk,
  markNotificationReadThunk,
} from "../store/slice/notification/notification.thunk";

import {acceptVolunteersThunk, rejectVolunteer} from '../store/slice/ngo/ngo.thunk' 

const Notification = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notification);


  useEffect(() => {
    dispatch(fetchNotificationsThunk());
  }, [dispatch]);

 const handleAcceptRequest = (notification) => {
  
  dispatch(
    acceptVolunteersThunk({
      ngoId: notification.receiverId._id || notification.receiverId.id || notification.receiverId,
      volunteerId: notification.senderId._id || notification.senderId.id || notification.senderId,
    })
  ).then(() => {
    dispatch(markNotificationReadThunk(notification._id)); // ✅ Mark after success
  });
};
const handleRejectRequest = (notification) => {
  dispatch(
    rejectVolunteer({
      ngoId: notification.receiverId,
      volunteerId: notification.senderId,
      notificationId: notification._id,
    })
  ).then(() => {
    dispatch(markNotificationReadThunk(notification._id));
  });
};



  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[100px]">
        <button className="btn btn-primary loading">Loading</button>
      </div>
    );

  if (!notifications || notifications.length === 0)
    return (
      <div className="p-6 text-center text-gray-500">
        No notifications found.
      </div>
    );

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-base-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>

      {notifications.map((n, index) => (
        <div
          key={n._id ?? index}
          className="border border-gray-300 rounded-md p-4 mb-4 shadow-sm"
        >
          <p className="mb-2">{n.message}</p>

       {n.type === "volunteer_request" && n.status !== "accepted" && (
  <div className="flex gap-2">
    <button
      onClick={() => handleAcceptRequest(n)}
      className="btn btn-sm btn-success"
    >
      Accept
    </button>
    <button
      onClick={() => handleRejectRequest(n)}
      className="btn btn-sm btn-error"
    >
      Reject
    </button>
  </div>
)}



          {n.status === "accepted" && (
            <span className="text-green-600 font-semibold">Accepted</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notification;
