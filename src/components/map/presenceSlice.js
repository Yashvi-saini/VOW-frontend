import { createSlice } from '@reduxjs/toolkit';

// Each remote avatar: { userId, name, x, y, targetX, targetY, lastUpdate }
// We keep targetX/targetY for interpolation; the rendered position can lerp toward target.
const initialState = {
  selfId: null,
  workspaceId: null,
  avatars: {}, // userId -> avatar state
};

const presenceSlice = createSlice({
  name: 'presence',
  initialState,
  reducers: {
    setIdentity(state, action) {
      const { selfId, workspaceId } = action.payload;
      state.selfId = selfId;
      state.workspaceId = workspaceId;
    },
    replaceAvatars(state, action) {
      const list = action.payload || [];
      const map = {};
      list.forEach(a => {
        map[a.userId] = { ...a, targetX: a.x, targetY: a.y };
      });
      state.avatars = map;
    },
    upsertAvatar(state, action) {
      const a = action.payload;
      const existing = state.avatars[a.userId];
      state.avatars[a.userId] = {
        userId: a.userId,
        name: a.name || a.userId,
        x: existing?.x ?? a.x,
        y: existing?.y ?? a.y,
        targetX: a.x,
        targetY: a.y,
        lastUpdate: Date.now(),
      };
    },
    updateAvatarPosition(state, action) {
      const { userId, x, y } = action.payload;
      const existing = state.avatars[userId];
      if (!existing) return;
      existing.targetX = x;
      existing.targetY = y;
      existing.lastUpdate = Date.now();
    },
    removeAvatar(state, action) {
      delete state.avatars[action.payload];
    },
    clearPresence(state) {
      state.avatars = {};
    }
  }
});

export const {
  setIdentity,
  replaceAvatars,
  upsertAvatar,
  updateAvatarPosition,
  removeAvatar,
  clearPresence
} = presenceSlice.actions;

export default presenceSlice.reducer;
