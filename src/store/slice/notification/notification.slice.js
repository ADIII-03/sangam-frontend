import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNotificationsThunk,
  markNotificationReadThunk,
} from "./notification.thunk";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {

      addNotification(state, action) {
      state.notifications.unshift(action.payload); // Add to top
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationReadThunk.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n._id === action.payload._id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
      });
  },
});

export const { clearNotifications, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
