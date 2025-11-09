import { createSlice } from "@reduxjs/toolkit";

// Minimal workspace slice to support components that read from state.workspace
// and to satisfy build imports in store.js. Prefer using userslice for
// workspace context where already wired, but this slice provides a stable
// fallback shape { id, name, token }.

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
