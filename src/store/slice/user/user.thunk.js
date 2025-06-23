import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../utils/axiosInstance.js";
import { setUserProfile } from "./user.slice.js";


export const loginUserThunk = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      
      return rejectWithValue(errorOutput);
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  "auth/signup",
 async (formData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/auth/signup", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (err) {
    const message =
    err?.response?.data?.message || // from backend JSON
    err.message || // fallback to generic message
    "Registration failed";
  return rejectWithValue(message);
  }
}

);

export const logoutUserThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const verifyEmailThunk = createAsyncThunk(
  "auth/verify-Email",
  async ({ verificationCode }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/verify-email", {
        verificationToken: verificationCode,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      return rejectWithValue(errorOutput);
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      
      const response = await axiosInstance.post(`/auth/reset-password/${token}`, {
        password,
      });
      toast.success("Password reset successfully!");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const checkAuthThunk = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/check-auth");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const updateUserProfileThunk = createAsyncThunk(
  "user/updateProfile",
  async (formData, { dispatch ,rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/update-user", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

        const updatedUser = response.data.user;

      // ✅ Update Redux state
      dispatch(setUserProfile(updatedUser));
      toast.success("Profile updated successfully!");

      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const getUserProfileThunk = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/get-user");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const getsuggestedUsersThunk = createAsyncThunk(
  "user/getsuggestedUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/get-other-users");
  
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const checkifngo = createAsyncThunk(
  "user/checkIfNgo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/my-profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);





export const searchUsers = createAsyncThunk(
  "user/searchUsers",
  async (searchTerm, { rejectWithValue }) => {
    if (!searchTerm || !searchTerm.trim()) {
      // Don't call API with empty query, just return empty results or a message
      return rejectWithValue("Please enter a search query.");
    }
    try {
      const response = await axiosInstance.get(`/auth/search/accounts`, {
        params: { query: searchTerm },
      });
      return response.data.accounts;
    } catch (error) {
      const errorOutput = error?.response?.data?.message || "Search failed";
      return rejectWithValue(errorOutput);
    }
  }
);


export const femaleVerifyThunk = createAsyncThunk(
  "user/verifyFemale",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/verify-female", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Verification failed");
    }
  }
);
