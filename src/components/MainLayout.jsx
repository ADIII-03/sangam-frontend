import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import RightSidebar from './RightSidebar';
import Footer from './Footer';
import FloatingShape from './FloatingShape';
import { Outlet } from 'react-router-dom';

import FloatingBackground from './FloatingBackground';

const MainLayout = () => {
  const location = useLocation();

  // Fix: Ensure pathname exists before comparing
  const isHomePage = location?.pathname === '/';

  return (
    <div className="flex h-screen">
      <FloatingBackground />

      {/* Sidebar - Hide on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Header />
       
        <div className="p-4">
          <Outlet />
        </div>
        <Footer />
      </div>

      {/* ✅ Right Sidebar only on home page */}
      {isHomePage && (
        <div className="hidden lg:block">
          <RightSidebar />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
