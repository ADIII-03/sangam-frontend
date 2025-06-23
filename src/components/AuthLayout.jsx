// src/components/AuthLayout.jsx

import React from 'react';
import FloatingShape from './FloatingShape';
import { Outlet } from 'react-router-dom';

import FloatingBackground from './FloatingBackground';

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <FloatingBackground />
   

      {/* Login/Signup Form Area */}
      <div className="relative z-10 w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
