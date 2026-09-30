import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  name: null,
  token: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspace(state, action) {
      const { id = null, name = null, token = null } = action.payload || {};
      state.id = id;
      state.name = name;
      state.token = token;
    },
    clearWorkspace(state) {
      state.id = null;
      state.name = null;
      state.token = null;
    },
  },
});

export const { setWorkspace, clearWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
