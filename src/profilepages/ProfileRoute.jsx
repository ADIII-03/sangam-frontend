import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkifngo } from "../store/slice/user/user.thunk";

const ProfileRoute = () => {
  const dispatch = useDispatch();
  const { userProfile: user } = useSelector((state) => state.user);

  const [redirectPath, setRedirectPath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user._id) return;

    const checkProfile = async () => {
      const resultAction = await dispatch(checkifngo());

      if (checkifngo.fulfilled.match(resultAction)) {
        const { success, ngo } = resultAction.payload;
        if (success && ngo) {
          setRedirectPath("/ngo-profile");
        } else {
          setRedirectPath("/user-profile");
        }
      } else if (checkifngo.rejected.match(resultAction)) {
        const payload = resultAction.payload;
        if (payload?.ngoExists === false) {
          // Valid case: NGO not found
          setRedirectPath("/user-profile");
        } else {
          // Unexpected error — maybe log it
          console.error("Unexpected error in NGO check:", resultAction.error);
          setRedirectPath("/user-profile");
        }
      }

      setLoading(false);
    };

    checkProfile();
  }, [dispatch, user]);

  if (loading) return <div>Checking profile...</div>;
  if (redirectPath) return <Navigate to={redirectPath} replace />;
  return null;
};

export default ProfileRoute;
