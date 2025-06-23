/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import {
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
  verifyEmailThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  getsuggestedUsersThunk,
  checkifngo,
  getUserProfileThunk,
  searchUsers,
  updateUserProfileThunk,
  femaleVerifyThunk
} from "./user.thunk";

const userProfileFromLocalStorageRaw = localStorage.getItem("userProfile");
const userProfileFromLocalStorage = userProfileFromLocalStorageRaw
  ? JSON.parse(userProfileFromLocalStorageRaw)
  : null;

const isAuthenticatedFromLocalStorage = !!userProfileFromLocalStorage;

const initialState = {
  isAuthenticated: isAuthenticatedFromLocalStorage,
  userProfile: userProfileFromLocalStorage ||null,
    otherUsers: [],
  selectedUser: JSON.parse(localStorage.getItem("selectedUser")),
  buttonLoading: false,
  screenLoading: false,
  ngoExists: false ,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      localStorage.setItem("selectedUser",JSON.stringify(action.payload))
      state.selectedUser = action.payload;
    },
    resetSearchState: (state) => {
  state.otherUsers = [];
  state.screenLoading = false;
} ,
setUserProfile: (state, action) => {
  state.userProfile = action.payload;
},


  },
  extraReducers: (builder) => {
    // login user
    builder.addCase(loginUserThunk.pending, (state, action) => {
      state.buttonLoading = true;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
  const user = action.payload?.user;
  state.userProfile = user;
  state.isAuthenticated = true;
  state.buttonLoading = false;

  // ✅ Save to localStorage
  localStorage.setItem("userProfile", JSON.stringify(user));
});

    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.buttonLoading = false;
    });

    // register user
    builder.addCase(registerUserThunk.pending, (state, action) => {
      state.buttonLoading = true;
    });
 builder.addCase(registerUserThunk.fulfilled, (state, action) => {
  const user = action.payload?.user;

  state.userProfile = user;
  state.buttonLoading = false;

  const isVerified = user?.isVerified || user?.emailVerified; // ✅ Adjust key based on your backend

  state.isAuthenticated = !!isVerified;

  // Save only if verified, or you can save anyway but handle on load
  localStorage.setItem("userProfile", JSON.stringify(user));
});


    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.buttonLoading = false;
    });

    // logout user
    builder.addCase(logoutUserThunk.pending, (state, action) => {
      state.buttonLoading = true;
    });
    builder.addCase(logoutUserThunk.fulfilled, (state, action) => {
      state.userProfile = null;
      state.selectedUser = null;
      state.otherUsers = null;
      state.isAuthenticated = false;
      state.buttonLoading = false;
      localStorage.clear();
    });
    builder.addCase(logoutUserThunk.rejected, (state, action) => {
      state.buttonLoading = false;
    });

    // verify email
    builder.addCase(verifyEmailThunk.pending, (state, action) => {
      state.buttonLoading = true;
    });
    builder.addCase(verifyEmailThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload?.responseData?.user;
      state.isAuthenticated = true;
      state.buttonLoading = false;
    });
    builder.addCase(verifyEmailThunk.rejected, (state, action) => {
      state.buttonLoading = false;
    });

    // forgot password
    builder.addCase(forgotPasswordThunk.pending, (state, action) => {
      state.buttonLoading = true;
    });
    builder.addCase(forgotPasswordThunk.fulfilled, (state, action) => {
      state.buttonLoading = false;
    });
    builder.addCase(forgotPasswordThunk.rejected, (state, action) => {
      state.buttonLoading = false;
    });

    // reset password
    builder.addCase(resetPasswordThunk.pending, (state, action) => {
      state.buttonLoading = true;
    });
    builder.addCase(resetPasswordThunk.fulfilled, (state, action) => {
      state.buttonLoading = false;
    });
    builder.addCase(resetPasswordThunk.rejected, (state, action) => {
      state.buttonLoading = false;
    });

    builder.addCase(getsuggestedUsersThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(getsuggestedUsersThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.otherUsers = action.payload?.users;
    });
    builder.addCase(getsuggestedUsersThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });


    builder 
    .addCase(checkifngo.pending , (state, action) => {
      state.screenLoading = true;
    })
    .addCase(checkifngo.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.ngoExists = true;
    })
    .addCase(checkifngo.rejected, (state, action) => {
      state.screenLoading = false;
        state.ngoExists = false;
    });

    builder.addCase(getUserProfileThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(getUserProfileThunk.fulfilled, (state, action) => {

      state.screenLoading = false;
      state.userProfile = action.payload?.user;
    });
    builder.addCase(getUserProfileThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });

    builder.addCase(searchUsers.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(searchUsers.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.otherUsers = action.payload ;
    });
    builder.addCase(searchUsers.rejected, (state, action) => {
      state.screenLoading = false;
    });

    builder
    .addCase(updateUserProfileThunk.pending, (state, action) => {
      state.buttonLoading = true;
    })
    .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
      state.buttonLoading = false;
    })
    .addCase(updateUserProfileThunk.rejected, (state, action) => {
      state.buttonLoading = false;
    });

    builder.addCase(femaleVerifyThunk.pending, (state, action) => {
      state.buttonLoading = true;
    });
    builder.addCase(femaleVerifyThunk.fulfilled, (state, action) => {
      state.buttonLoading = false;
      state.userProfile = action.payload;
        localStorage.setItem("userProfile", JSON.stringify(action.payload));
    });
    builder.addCase(femaleVerifyThunk.rejected, (state, action) => {
      state.buttonLoading = false;
    });
  },
});

export const { setSelectedUser , resetSearchState ,setUserProfile } = userSlice.actions;

export default userSlice.reducer;