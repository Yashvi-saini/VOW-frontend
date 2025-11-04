import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: null,
    fullName: null,
    email: null,
    avatar: null,
  },
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
    clearUser: (state) => {
      state.username = null;
      state.fullName = null;
      state.email = null;
      state.avatar = null;
    }
  },
});

export const { setUsername, setUserProfile, clearUser } = userSlice.actions;
export default userSlice.reducer;