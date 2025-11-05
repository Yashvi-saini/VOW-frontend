import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  fullName: null,
  email: null,
  avatar: null,
  workspaceId: null,
  workspaceToken: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setUserProfile: (state, action) => {
      const { username, fullName, email, avatar } = action.payload || {};
      if (username !== undefined) state.username = username;
      if (fullName !== undefined) state.fullName = fullName;
      if (email !== undefined) state.email = email;
      if (avatar !== undefined) state.avatar = avatar;
    },
    setUserAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    setWorkspaceContext: (state, action) => {
      const { workspaceId, workspaceToken } = action.payload || {};
      state.workspaceId = workspaceId || null;
      state.workspaceToken = workspaceToken || null;
    },
    clearWorkspaceContext: (state) => {
      state.workspaceId = null;
      state.workspaceToken = null;
    },
    clearUser: (state) => {
      state.username = null;
      state.fullName = null;
      state.email = null;
      state.avatar = null;
      state.workspaceId = null;
      state.workspaceToken = null;
    },
  },
});

export const {
  setUsername,
  setUserProfile,
  setUserAvatar,
  setWorkspaceContext,
  clearWorkspaceContext,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;