import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utils/axiosInstance";

// Fetch all notifications
export const fetchNotificationsThunk = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/notifications");
      return res.data.notifications; // Adjust key as per your backend response
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Accept or mark a notification
export const markNotificationReadThunk = createAsyncThunk(
  "notifications/markRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/notifications/${notificationId}/mark-read`);
      return res.data.notification;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
