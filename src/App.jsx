// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import WhoAreYouPage from './pages/WhoAreYouPage';
import FemaleVerificationPage from './pages/FemaleVerificationPage';
import Home from './pages/Home';

import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import AuthLayout from './components/AuthLayout';

import Notification from './profilepages/Notification.jsx';
import Search from './profilepages/Search.jsx';
import ProfileRoute from './profilepages/ProfileRoute.jsx';
import UserProfile from './profilepages/UserProfile.jsx';
import NgoProfile from './profilepages/NgoProfile.jsx';
import NGOVolunteers from './profilepages/NGOVolunteers.jsx';

import NGOPostForm from './post&update/NgoPost.jsx';
import UpdateNgoProfile from './post&update/UpdateNgo.jsx';
import ProtectedNgoOwnerRoute from './components/NgoRoute.jsx';
import UpdateUser from './post&update/UpdateUser.jsx';
import UserPost from './post&update/UserPost.jsx';
import CreateNGOForm from './pages/CreateOrganisation.jsx';
import socket from './socket.js';
import { addNotification } from './store/slice/notification/notification.slice.js';
import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast} from 'react-hot-toast';
import AllChats from './chat/AllChats.jsx';
import ChatWrapper from './chat/ChatWrapper.jsx';

function App() {
 const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.userProfile);

  useEffect(() => {
  if (currentUser?._id) {
  
    socket.emit("joinUserRoom",currentUser._id.toString());
  }
}, [currentUser?._id]);

useEffect(() => {
  socket.on('connect', () => {
    
  });
}, []);

useEffect(() => {
  const handleNewNotification = (notification) => {
    

    dispatch(addNotification(notification));
  switch (notification.type) {
      case "volunteer_request":
        toast(
          (t) => (
            <div style={{ padding: '10px', color: '#0f5132', backgroundColor: '#d1e7dd', borderRadius: '8px' }}>
              <strong>🤝 Volunteer Request</strong>
              <div>{`New volunteer request from ${notification.senderId.name || 'someone'}`}</div>
              <button onClick={() => toast.dismiss(t.id)} style={{ marginTop: '5px', cursor: 'pointer' }}>
                Dismiss
              </button>
            </div>
          ),
          { duration: 8000 }
        );
        break;

      case "volunteer_acceptance":
        toast.success(
          notification.message || "Your volunteer request was accepted!",
          {
            icon: '✅',
            duration: 5000,
          }
        );
        break;

      case "like":
        toast(
          (t) => (
            <div style={{ padding: '10px', color: '#333', backgroundColor: '#e0e0e0', borderRadius: '8px' }}>
              <strong>👍 New Like</strong>
              <div>{`${notification.senderId.name || 'Someone'} liked your post!`}</div>
              <button onClick={() => toast.dismiss(t.id)} style={{ marginTop: '5px', cursor: 'pointer' }}>
                Close
              </button>
            </div>
          ),
          { duration: 4000 }
        );
        break;

      case "comment":
        toast(
          (t) => (
            <div style={{ padding: '10px', color: '#055160', backgroundColor: '#cff4fc', borderRadius: '8px' }}>
              <strong>💬 New Comment</strong>
              <div>{`${notification.senderId.name || 'Someone'} commented: "${notification.commentText || ''}"`}</div>
              <button onClick={() => toast.dismiss(t.id)} style={{ marginTop: '5px', cursor: 'pointer' }}>
                Close
              </button>
            </div>
          ),
          { duration: 6000 }
        );
        break;

      default:
        toast(notification.message || "You have a new notification");
    }

  };

  socket.on("newNotification", handleNewNotification);

  return () => {
    socket.off("newNotification", handleNewNotification);
  };
}, [dispatch]); // Don't depend on _id here


  return (
    <Routes>
    
      <Route element={<AuthLayout />}>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

     
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/who-are-you" element={<WhoAreYouPage />} />
          <Route path="/create-organisation" element={<CreateNGOForm />} />
      {/* Protected + Main layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/search" element={<Search />} />
          <Route path="/female-verification" element={<FemaleVerificationPage />} />

                <Route path="/profile" element={<ProfileRoute />} />
<Route path="/user/:id" element={<UserProfile />} />
<Route path="/user-profile" element={<UserProfile />} />
<Route path="user/update/:id" element={<UpdateUser />} />
<Route path="user/:id/create-post" element={<UserPost />} />

      <Route path="/ngo-profile" element={<NgoProfile />} />
      <Route path="/ngo/:id" element={<NgoProfile />} />
      <Route path="/ngo/:id/volunteers" element={<NGOVolunteers />} />


       <Route element={<ProtectedNgoOwnerRoute />}>
      <Route path="/ngo/:id/create-post" element={<NGOPostForm />} />
      <Route path="/ngo/:id/update" element={<UpdateNgoProfile />} />
    </Route>
      <Route path="/messages" element={<AllChats />} />
      <Route path="/messages/:id" element={<ChatWrapper />} />

        </Route>
      </Route>

    </Routes>
  );
}

export default App;
