import { createSlice } from '@reduxjs/toolkit';
import {
  createUserPostThunk,
  getAllUserPostsThunk,
  getUserPostByIdThunk,
  updateUserPostThunk,
  deleteUserPostThunk,
  likeUserPostThunk,
  commentOnUserPostThunk,
  flagUserPostThunk,
  shareUserPostThunk,
  getWhoCommentedOnUserPostThunk,
} from './userpost.thunk';

const initialState = {
  userPosts: [],
  hasMoreUserPosts: true,
  userPost: null,
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
  commenters: [],
  buttonLoading: false
};

export const userpostSlice = createSlice({
  name: "userpost",
  initialState,
  reducers: {
    // Add reducers here
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserPostThunk.pending, (state) => {
        state.createLoading = true;
        state.buttonLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createUserPostThunk.fulfilled, (state, action) => {
        state.createLoading = false;
        state.userPosts.push(action.payload.post);
        state.buttonLoading = false;
        state.createSuccess = true;
      })
      .addCase(createUserPostThunk.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
        state.createSuccess = false;
        state.buttonLoading = false;
      })
      .addCase(getAllUserPostsThunk.pending, (state) => {
        state.getAllLoading = true;
        state.getAllError = null;
      })
      .addCase(getAllUserPostsThunk.fulfilled, (state, action) => {
        state.getAllLoading = false;
  if (action.payload.posts.length === 0) {
    state.hasMoreUserPosts = false; // no more pages
  } else {
    state.userPosts = [...state.userPosts, ...action.payload.posts];
  }
      })
      .addCase(getAllUserPostsThunk.rejected, (state, action) => {
        state.getAllLoading = false;
        state.getAllError = action.payload;
      })
      .addCase(getUserPostByIdThunk.pending, (state) => {
        state.getByIdLoading = true;
        state.getByIdError = null;
      })
      .addCase(getUserPostByIdThunk.fulfilled, (state, action) => {
        state.getByIdLoading = false;
        state.userPost = action.payload.post;
      })
      .addCase(getUserPostByIdThunk.rejected, (state, action) => {
        state.getByIdLoading = false;
        state.getByIdError = action.payload;
      })
      .addCase(updateUserPostThunk.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserPostThunk.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.userPosts.findIndex(post => post._id === action.payload.post._id);
        if (index !== -1) {
          state.userPosts[index] = action.payload.post;
        }
        state.userPost = action.payload.post;
        state.updateSuccess = true;
      })
      .addCase(updateUserPostThunk.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
      })
      .addCase(deleteUserPostThunk.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteUserPostThunk.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.userPosts = state.userPosts.filter(post => post._id !== action.meta.arg);
        state.deleteSuccess = true;
      })
      .addCase(deleteUserPostThunk.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
        state.deleteSuccess = false;
      })
      .addCase(likeUserPostThunk.pending, (state) => {
        state.likeLoading = true;
        state.likeError = null;
      })
      .addCase(likeUserPostThunk.fulfilled, (state, action) => {
        state.likeLoading = false;
        const index = state.userPosts.findIndex(post => post._id === action.payload.post._id);
        if (index !== -1) {
          state.userPosts[index] = action.payload.post;
        }
        if (state.userPost && state.userPost._id === action.payload.post._id) {
          state.userPost = action.payload.post;
        }
      })
      .addCase(likeUserPostThunk.rejected, (state, action) => {
        state.likeLoading = false;
        state.likeError = action.payload;
      })
      .addCase(commentOnUserPostThunk.pending, (state) => {
        state.commentLoading = true;
        state.commentError = null;
      })
      .addCase(commentOnUserPostThunk.fulfilled, (state, action) => {
        state.commentLoading = false;
        const index = state.userPosts.findIndex(post => post._id === action.payload.post._id);
        if (index !== -1) {
          state.userPosts[index] = action.payload.post;
        }
        if (state.userPost && state.userPost._id === action.payload.post._id) {
          state.userPost = action.payload.post;
        }
      })
      .addCase(commentOnUserPostThunk.rejected, (state, action) => {
        state.commentLoading = false;
        state.commentError = action.payload;
      })
      .addCase(flagUserPostThunk.pending, (state) => {
        state.flagLoading = true;
        state.flagError = null;
      })
      .addCase(flagUserPostThunk.fulfilled, (state, action) => {
        state.flagLoading = false;
        const index = state.userPosts.findIndex(post => post._id === action.payload.post._id);
        if (index !== -1) {
          state.userPosts[index] = action.payload.post;
        }
        if (state.userPost && state.userPost._id === action.payload.post._id) {
          state.userPost = action.payload.post;
        }
      })
      .addCase(flagUserPostThunk.rejected, (state, action) => {
        state.flagLoading = false;
        state.flagError = action.payload;
      })
      .addCase(shareUserPostThunk.pending, (state) => {
        state.shareLoading = true;
        state.shareError = null;
      })
      .addCase(shareUserPostThunk.fulfilled, (state, action) => {
        state.shareLoading = false;
        const index = state.userPosts.findIndex(post => post._id === action.payload.post._id);
        if (index !== -1) {
          state.userPosts[index] = action.payload.post;
        }
        if (state.userPost && state.userPost._id === action.payload.post._id) {
          state.userPost = action.payload.post;
        }
      })
      .addCase(shareUserPostThunk.rejected, (state, action) => {
        state.shareLoading = false;
        state.shareError = action.payload;
      });

   builder
   .addCase(getWhoCommentedOnUserPostThunk.pending, (state) => {
    state.commentLoading = true;
    state.commentError = null;
  }
  )
  .addCase(getWhoCommentedOnUserPostThunk.fulfilled, (state, action) => {
    state.commentLoading = false;
    state.commenters = action.payload.commenters;
  })
  .addCase(getWhoCommentedOnUserPostThunk.rejected, (state, action) => {
    state.commentLoading = false;
    state.commentError = action.payload;
  });
  },
});

export default userpostSlice.reducer;