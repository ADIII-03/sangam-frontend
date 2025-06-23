import { createSlice } from "@reduxjs/toolkit";
import { commentOnNGOPostThunk, createNGOPostThunk, deleteNGOPostThunk, flagNGOPostThunk, getAllNGOPostsThunk, getNGOPostByIdThunk, getWhoCommentedOnNGOPostThunk, likeNGOPostThunk, shareNGOPostThunk, updateNGOPostThunk } from "./ngopost.thunk";

const initialState = {
  ngoposts: [],
  hasMoreNgoPosts: true,
  ngopost: null,
  createLoading: false,
  createError: null,
  createSuccess: false,
  getAllLoading: false,
  getAllError: null,
  getByIdLoading: false,
  getByIdError: null,
  updateLoading: false,
  updateError: null,
  updateSuccess: false,
  deleteLoading: false,
  deleteError: null,
  deleteSuccess: false,
  likeLoading: false,
  likeError: null,
  commentLoading: false,
  commentError: null,
  flagLoading: false,
  flagError: null,
  shareLoading: false,
  shareError: null,
};

export const ngopostSlice = createSlice({
  name: "ngopost",
  initialState,
  reducers: {
    // Define your reducers here
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNGOPostThunk.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createNGOPostThunk.fulfilled, (state, action) => {
        state.createLoading = false;
        state.ngoposts.push(action.payload.post);
        state.createSuccess = true;
      })
      .addCase(createNGOPostThunk.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
        state.createSuccess = false;
      })
      .addCase(getAllNGOPostsThunk.pending, (state) => {
        state.getAllLoading = true;
        state.getAllError = null;
      })
      .addCase(getAllNGOPostsThunk.fulfilled, (state, action) => {
        state.getAllLoading = false;
           if (action.payload.posts.length === 0) {
          // No more posts to load
          state.hasMoreNGOPosts = false;
        } else {
          // Append new posts to existing list
          state.ngoposts = [...state.ngoposts, ...action.payload.posts];
        }
      })
      .addCase(getAllNGOPostsThunk.rejected, (state, action) => {
        state.getAllLoading = false;
        state.getAllError = action.payload;
      })
      .addCase(getNGOPostByIdThunk.pending, (state) => {
        state.getByIdLoading = true;
        state.getByIdError = null;
      })
      .addCase(getNGOPostByIdThunk.fulfilled, (state, action) => {
        state.getByIdLoading = false;
        state.ngopost = action.payload.post;
      })
      .addCase(getNGOPostByIdThunk.rejected, (state, action) => {
        state.getByIdLoading = false;
        state.getByIdError = action.payload;
      })
      .addCase(updateNGOPostThunk.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateNGOPostThunk.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.ngoposts.findIndex(post => post._id === action.payload.post._id);
        if (index !== -1) {
          state.ngoposts[index] = action.payload.post;
        }
        state.ngopost = action.payload.post;
        state.updateSuccess = true;
      })
      .addCase(updateNGOPostThunk.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
      })
      .addCase(deleteNGOPostThunk.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteNGOPostThunk.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.ngoposts = state.ngoposts.filter(post => post._id !== action.meta.arg);
        state.deleteSuccess = true;
      })
      .addCase(deleteNGOPostThunk.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
        state.deleteSuccess = false;
      })

      builder
      .addCase(likeNGOPostThunk.pending, (state) => {
        state.likeLoading = true;
        state.likeError = null;
      })
      .addCase(likeNGOPostThunk.fulfilled, (state, action) => {
        state.likeLoading = false;
        const index = state.ngoposts.findIndex(post => post._id === action.payload.post._id);
        if (index !== -1) {
          state.ngoposts[index] = action.payload.post;
        }
        if (state.ngopost && state.ngopost._id === action.payload.post._id) {
          state.ngopost = action.payload.post;
        }
      })
      .addCase(likeNGOPostThunk.rejected, (state, action) => {
        state.likeLoading = false;
        state.likeError = action.payload;
      })
      .addCase(commentOnNGOPostThunk.pending, (state) => {
        state.commentLoading = true;
        state.commentError = null;
      })
      .addCase(commentOnNGOPostThunk.fulfilled, (state, action) => {
        state.commentLoading = false;
        const index = state.ngoposts.findIndex(post => post._id === action.payload.post._id);
        if (index !== -1) {
          state.ngoposts[index] = action.payload.post;
        }
        if (state.ngopost && state.ngopost._id === action.payload.post._id) {
          state.ngopost = action.payload.post;
        }
      })
      .addCase(commentOnNGOPostThunk.rejected, (state, action) => {
        state.commentLoading = false;
        state.commentError = action.payload;
      })
      .addCase(flagNGOPostThunk.pending, (state) => {
        state.flagLoading = true;
        state.flagError = null;
      })
      .addCase(flagNGOPostThunk.fulfilled, (state, action) => {
        state.flagLoading = false;
        const index = state.ngoposts.findIndex(post => post._id === action.payload.post._id);
        if (index !== -1) {
          state.ngoposts[index] = action.payload.post;
        }
        if (state.ngopost && state.ngopost._id === action.payload.post._id) {
          state.ngopost = action.payload.post;
        }
      })
      .addCase(flagNGOPostThunk.rejected, (state, action) => {
        state.flagLoading = false;
        state.flagError = action.payload;
      })
      .addCase(shareNGOPostThunk.pending, (state) => {
        state.shareLoading = true;
        state.shareError = null;
      })
      .addCase(shareNGOPostThunk.fulfilled, (state, action) => {
        state.shareLoading = false;
        const index = state.ngoposts.findIndex(post => post._id === action.payload.post._id);
        if (index !== -1) {
          state.ngoposts[index] = action.payload.post;
        }
        if (state.ngopost && state.ngopost._id === action.payload.post._id) {
          state.ngopost = action.payload.post;
        }
      })
      .addCase(shareNGOPostThunk.rejected, (state, action) => {
        state.shareLoading = false;
        state.shareError = action.payload;
      });

      builder
      .addCase(getWhoCommentedOnNGOPostThunk.pending, (state) => {
        state.commentLoading = true;
        state.commentError = null;
      })
      .addCase(getWhoCommentedOnNGOPostThunk.fulfilled, (state, action) => {
        state.commentLoading = false;
        state.commenters = action.payload.commenters;
      })
      .addCase(getWhoCommentedOnNGOPostThunk.rejected, (state, action) => {
        state.commentLoading = false;
        state.commentError = action.payload;
      });


  },
});

export default ngopostSlice.reducer;