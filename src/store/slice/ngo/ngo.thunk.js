import { createAsyncThunk } from '@reduxjs/toolkit';

import {axiosInstance} from '../../../utils/axiosInstance.js';
import {toast} from 'react-hot-toast';

export const createngoThunk = createAsyncThunk(
  'ngo/create',
  async (ngoData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/ngo/create', ngoData, {
        headers: {
          // ✅ Remove this line:
          // 'Content-Type': 'application/json',
          
          // ✅ Optional: set auth token if needed
          // Authorization: `Bearer ${yourToken}`,
        },
      });
      toast.success('NGO created successfully');
      return response.data;
    } catch (error) {
      const errorOutput = error?.response?.data?.errMessage || error.message;
      return rejectWithValue(errorOutput);
    }
  }
);

export const getNgoProfileThunk = createAsyncThunk(
  'ngo/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/auth/my-profile');
      return response.data.ngo;
    } catch (error) {
      const errorOutput = error?.response?.data?.errMessage || error.message;
      return rejectWithValue(errorOutput);
    }
  }
);

export const updateNgoProfileThunk = createAsyncThunk(
  'ngo/updateProfile',
  async ({ ngoId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/ngo/${ngoId}/update-ngo`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('NGO profile updated successfully');
      return response.data.ngo;
    } catch (error) {
      const errorOutput = error?.response?.data?.errMessage || error.message;
      return rejectWithValue(errorOutput);
    }
  }
);




export const getNgoPostsThunk = createAsyncThunk(
  'ngo/getPosts',
  async (ngoId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/ngo/get-posts/${ngoId}`);
      return response.data;
    } catch (error) {
      const errorOutput = error?.response?.data?.errMessage || error.message;
      return rejectWithValue(errorOutput);
    }
  }
);


export const requestVolunteer = createAsyncThunk(
  'ngo/requestVolunteer',
  async (ngoId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/auth/${ngoId}/request-volunteer`);
      return response.data;
    } catch (error) {
      const errorOutput = error?.response?.data?.errMessage || error.message;
      return rejectWithValue(errorOutput);
    }
  }
);

export const rejectVolunteer = createAsyncThunk(
  'ngo/rejectVolunteer',
  async ({ ngoId, volunteerId, notificationId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/ngo/${ngoId}/reject-volunteer`, {
        volunteerId,
        notificationId,
      });
      return response.data;
    } catch (error) {
      const errorOutput = error?.response?.data?.errMessage || error.message;
      return rejectWithValue(errorOutput);
    }
  }
);


export const acceptVolunteersThunk = createAsyncThunk(
  'ngo/acceptVolunteers',
  async ({ngoId, volunteerId}, { rejectWithValue }) => {
    try {

      const response = await axiosInstance.post(`/ngo/${ngoId}/accept-volunteer`, {volunteerId});
      

      return response.data;
    } catch (error) {
      const errorOutput = error?.response?.data?.errMessage || error.message;
      return rejectWithValue(errorOutput);
    }
  }
);