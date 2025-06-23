import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {axiosInstance} from "../utils/axiosInstance"; // or use fetch

const ProtectedNgoOwnerRoute = () => {
  const { isAuthenticated, userProfile } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [hasNgo, setHasNgo] = useState(false);

  useEffect(() => {
    const checkNgo = async () => {
      if (!isAuthenticated || !userProfile) {
        setLoading(false);
        setHasNgo(false);
        return;
      }
      try {
        // Call API that returns NGO for this user, e.g. GET /auth/my-profile
        const response = await axiosInstance.get("/auth/my-profile");
        if (response.data.success && response.data.ngo) {
          setHasNgo(true);
        } else {
          setHasNgo(false);
        }
      } catch (error) {
        setHasNgo(false);
      } finally {
        setLoading(false);
      }
    };

    checkNgo();
  }, [isAuthenticated, userProfile]);

  if (!isAuthenticated) {
    // Not logged in at all
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <p className="text-center mt-10">Checking NGO ownership...</p>;
  }

  if (!hasNgo) {
    // Logged in but does NOT have an NGO profile
    return <Navigate to="/unauthorized" replace />;
  }

  // User is logged in AND owns an NGO => allow access
  return <Outlet />;
};

export default ProtectedNgoOwnerRoute;
