import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../utils/axiosInstance.js";

export const createUserPostThunk = createAsyncThunk(
  "userpost/create",
  async (postData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('caption', postData.caption);
      formData.append('category', postData.category);
      formData.append('location[address]', postData.location.address);
      formData.append('location[coordinates][0]', postData.location.coordinates[0]);
      formData.append('location[coordinates][1]', postData.location.coordinates[1]);

      if (postData.images) {
        postData.images.forEach(file => {
          formData.append('images', file);
        });
      }
      if (postData.videos) {
        postData.videos.forEach(file => {
          formData.append('videos', file);
        });
      }
      if (postData.documents) {
        postData.documents.forEach(file => {
          formData.append('documents', file);
        });
      }

      const response = await axiosInstance.post("/userpost/create", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // you can dispatch redux action here to update progress state if you want

        },
      });

      toast.success("User Post created successfully!");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const getAllUserPostsThunk = createAsyncThunk(
  "userpost/getAll",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/userpost", {
        params: { page, limit },
      });
      // Assuming response.data contains paginated posts and metadata
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const getUserPostByIdThunk = createAsyncThunk(
  "userpost/getById",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/userpost/${postId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const updateUserPostThunk = createAsyncThunk(
  "userpost/update",
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('caption', postData.caption);
      formData.append('category', postData.category);
      formData.append('location[address]', postData.location.address);
      formData.append('location[coordinates][0]', postData.location.coordinates[0]);
      formData.append('location[coordinates][1]', postData.location.coordinates[1]);

      // Append files based on type
      if (postData.images) {
        postData.images.forEach(file => {
          formData.append('images', file);
        });
      } else if (postData.videos) {
         postData.videos.forEach(file => {
          formData.append('videos', file);
        });
      } else if (postData.documents) {
         postData.documents.forEach(file => {
          formData.append('documents', file);
        });
      }

      const response = await axiosInstance.put(`/userpost/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("User Post updated successfully!");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const deleteUserPostThunk = createAsyncThunk(
  "userpost/delete",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/userpost/${postId}`);
      toast.success("User Post deleted successfully!");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const likeUserPostThunk = createAsyncThunk(
  "userpost/like",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/userpost/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const commentOnUserPostThunk = createAsyncThunk(
  "userpost/comment",
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/userpost/${postId}/comment`, {text: comment});
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.message || error.message;

      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const flagUserPostThunk = createAsyncThunk(
  "userpost/flag",
  async ({ postId , reason}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/userpost/${postId}/flag` , { reason });
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const shareUserPostThunk = createAsyncThunk(
  "userpost/share",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/userpost/${postId}/share`);
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const getWhoCommentedOnUserPostThunk = createAsyncThunk(
  "userpost/getWhoCommented",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/userpost/${postId}/get-who-comment`);
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);