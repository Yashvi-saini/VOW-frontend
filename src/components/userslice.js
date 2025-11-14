import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null, 
  username: null,
  email: null,
  avatar: null,
  fullName: null,
  workspaceId: null,
  workspaceToken: null,
  workspaceName: null,
  workspaceManagerId: null, // manager/owner id for current workspace
  // profile gating
  isProfileNeeded: false,
  signupDone: false,
  // transient auth/OTP flows (can be persisted but will be cleared on success)
  signupPending: false,
  forgotRequested: false,
  pendingEmail: null,
  pendingMode: null, // "signup" | "forgot"
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setUserProfile: (state, action) => {
  state.profile = action.payload; // store full profile object
},
    setUserAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    setWorkspaceContext: (state, action) => {
      const { workspaceId, workspaceToken, workspaceName, workspaceManagerId } = action.payload || {};
      state.workspaceId = workspaceId || null;
      state.workspaceToken = workspaceToken || null;
      state.workspaceName = workspaceName || null;
      if (workspaceManagerId) state.workspaceManagerId = workspaceManagerId;
    },
    clearWorkspaceContext: (state) => {
      state.workspaceId = null;
      state.workspaceToken = null;
      state.workspaceName = null;
      state.workspaceManagerId = null;
    },
    clearUser: (state) => {
      state.username = null;
      state.fullName = null;
      state.email = null;
      state.avatar = null;
      state.workspaceId = null;
      state.workspaceToken = null;
    },
    setProfileNeeded: (state, action) => {
  state.isProfileNeeded = action.payload; 
},
    setSignupDone: (state, action) => {
      state.signupDone = action.payload;
    },
    // Flow controls
    startSignupFlow: (state, action) => {
      state.signupPending = true;
      state.pendingEmail = action.payload || null;
      state.pendingMode = "signup";
    },
    setUserId: (state, action) => {
  state.userId = action.payload;
},

    clearSignupFlow: (state) => {
      state.signupPending = false;
      if (state.pendingMode === "signup") {
        state.pendingEmail = null;
        state.pendingMode = null;
      }
    },
    startForgotFlow: (state, action) => {
      state.forgotRequested = true;
      state.pendingEmail = action.payload || null;
      state.pendingMode = "forgot";
    },
    clearForgotFlow: (state) => {
      state.forgotRequested = false;
      if (state.pendingMode === "forgot") {
        state.pendingEmail = null;
        state.pendingMode = null;
      }
    },
  },
});

export const {
  setUserId,
  setUsername,
  setUserProfile,
  setUserAvatar,
  setWorkspaceContext,
  clearWorkspaceContext,
  clearUser,
  setProfileNeeded,
  setSignupDone,
  startSignupFlow,
  clearSignupFlow,
  startForgotFlow,
  clearForgotFlow,
} = userSlice.actions;

export default userSlice.reducer;