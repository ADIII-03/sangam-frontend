import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../utils/axiosInstance.js";
import {addPartner, setPartnersWithLastMessages,markMessagesSeen} from "./message.slice.js";

// ✅ 1. Send a Message
export const sendMessageThunk = createAsyncThunk(
  "message/send",
  async ({ receiverId, message }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/message/send/${receiverId}`, { message });
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || "Failed to send message.";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

// ✅ 2. Get Messages for a Chat
export const getMessageThunk = createAsyncThunk(
  "message/get",
  async ({ receiverId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/message/get/${receiverId}`);
      return response.data;
    } catch (error) {
      
      const errorOutput = error?.response?.data?.errMessage || "Failed to fetch messages.";
     
      return rejectWithValue(errorOutput);
    }
  }
);

// ✅ 3. Get Chat Partners
export const getPartners = createAsyncThunk(
  "message/partners",
  async (currentUserId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/message/partners/${currentUserId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || "Failed to fetch partners.";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);


// message.thunk.js

export const fetchUserAndAddToPartners = createAsyncThunk(
  "message/fetchUserAndAddToPartners",
  async (partnerId, { dispatch, getState, rejectWithValue }) => {
    try {
      const existing = getState().message.partners.find((p) => p._id === partnerId);
      if (existing) return existing;

      const { data } = await axiosInstance.get(`/message/partner/${partnerId}`);
      if (data?.partner) {
        
        dispatch(addPartner(data.partner));
        dispatch(getMessageThunk({ receiverId: partnerId }));
        return data.partner;
      }
      return rejectWithValue("Partner not found");
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch partner");
    }
  }
);


// In your message.thunk.js
export const getPartnersWithLastMessagesThunk = (userId) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(`/message/partnersWithLastMessages/${userId}`);
   
    if (response.data.success) {
      dispatch(setPartnersWithLastMessages(response.data.partners));
    }
  } catch (error) {
    console.error("Failed to load partners with last messages", error);
  }
};


export const markMessagesSeenThunk = createAsyncThunk(
  "message/markSeen",
  async ({ receiverId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/message/seen/${receiverId}`);

      if (response.data.success) {
        dispatch(markMessagesSeen({ receiverId }));
      }

      return response.data;
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Failed to mark messages as seen.";
      return rejectWithValue(errMsg);
    }
  }
);
