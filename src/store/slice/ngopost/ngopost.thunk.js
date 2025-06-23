import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../utils/axiosInstance.js";


export const createNGOPostThunk = createAsyncThunk(
  "ngopost/create",
  async (postData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('caption', postData.caption);
      formData.append('type', postData.type);
      formData.append('category', postData.category);
      formData.append('location[address]', postData.location.address);
      formData.append('location[coordinates][]', postData.location.coordinates[0]);
      formData.append('location[coordinates][]', postData.location.coordinates[1]);

       if (postData.location) {
        formData.append('location[address]', postData.location.address || '');
        formData.append('location[coordinates][]', postData.location.coordinates[0] || 0);
        formData.append('location[coordinates][]', postData.location.coordinates[1] || 0);
      }

      if (postData.type === 'image' && postData.images) {
        postData.images.forEach(file => {
          formData.append('images', file);
        });
      } else if (postData.type === 'video' && postData.videos) {
        postData.videos.forEach(file => {
          formData.append('videos', file);
        });
      } else if (postData.type === 'document' && postData.documents) {
        postData.documents.forEach(file => {
          formData.append('documents', file);
        });
      }

      const response = await axiosInstance.post("/ngopost/create", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("NGO Post created successfully!");
      return response.data;
    } catch (error) {
     console.error('Error response data:', error.response?.data);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const getAllNGOPostsThunk = createAsyncThunk(
  "ngopost/getAll",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/ngopost/", {
        params: { page, limit },
      });
      // Assuming response.data includes { posts, page, totalPages, totalPosts }
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const getNGOPostByIdThunk = createAsyncThunk(
  "ngopost/getById",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/ngopost/${postId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const updateNGOPostThunk = createAsyncThunk(
  "ngopost/update",
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('caption', postData.caption);
      formData.append('type', postData.type);
      formData.append('category', postData.category);
      formData.append('location[address]', postData.location.address);
      formData.append('location[coordinates][]', postData.location.coordinates[0]);
      formData.append('location[coordinates][]', postData.location.coordinates[1]);

      if (postData.type === 'image' && postData.images) {
        postData.images.forEach(file => {
          formData.append('images', file);
        });
      } else if (postData.type === 'video' && postData.videos) {
        postData.videos.forEach(file => {
          formData.append('videos', file);
        });
      } else if (postData.type === 'document' && postData.documents) {
        postData.documents.forEach(file => {
          formData.append('documents', file);
        });
      }

      const response = await axiosInstance.put(`/ngopost/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("NGO Post updated successfully!");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const deleteNGOPostThunk = createAsyncThunk(
  "ngopost/delete",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/ngopost/${postId}`);
      toast.success("NGO Post deleted successfully!");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const likeNGOPostThunk = createAsyncThunk(
  "ngopost/like",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/ngopost/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput =
  error?.response?.data?.message || error?.response?.data?.errMessage || error.message;

      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const commentOnNGOPostThunk = createAsyncThunk(
  "ngopost/comment",
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/ngopost/${postId}/comment`, { text: comment });
      return {
        post: response.data.post,  // <-- Use the full updated post here
      };

    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);


export const flagNGOPostThunk = createAsyncThunk(
  "ngopost/flag",
  async ({ postId, reason }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/ngopost/${postId}/flag`, { reason });
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const shareNGOPostThunk = createAsyncThunk(
  "ngopost/share",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/ngopost/${postId}/share`);
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);


export const getWhoCommentedOnNGOPostThunk = createAsyncThunk(
  "ngopost/commenters",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/ngopost/${postId}/commenters`);
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);
