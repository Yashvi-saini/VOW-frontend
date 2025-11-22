import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  avatars: {},        // remote users
  selfId: null,       // my real presence ID from join-ack
  workspaceId: null,  // optional
};

const presenceSlice = createSlice({
  name: 'presence',
  initialState,
  reducers: {
    setIdentity(state, action) {
      const { selfId, workspaceId } = action.payload;
      state.selfId = selfId;
      if (workspaceId) state.workspaceId = workspaceId;
    },

    replaceAvatars(state, action) {
      const list = action.payload || [];
      const newMap = {};

      list.forEach(avatar => {
        if (avatar.userId === state.selfId) return;

        newMap[avatar.userId] = {
          userId: avatar.userId,
          displayName: avatar.displayName,
          x: avatar.x ?? 50,
          y: avatar.y ?? 50,
          targetX: avatar.x ?? 50,
          targetY: avatar.y ?? 50,
          lastUpdate: Date.now(),
        };
      });

      state.avatars = newMap;
    },

    upsertAvatar(state, action) {
      const a = action.payload;
      if (!a || a.userId === state.selfId) return;

      const existing = state.avatars[a.userId];

      state.avatars[a.userId] = {
        userId: a.userId,
        displayName: a.displayName,
        x: existing?.x ?? a.x ?? 50,
        y: existing?.y ?? a.y ?? 50,
        targetX: a.x ?? existing?.targetX ?? 50,
        targetY: a.y ?? existing?.targetY ?? 50,
        lastUpdate: Date.now(),
      };
    },

    updateAvatarPosition(state, action) {
      const { userId, x, y } = action.payload;
      if (userId === state.selfId) return;

      const avatar = state.avatars[userId];
      if (avatar) {
        avatar.targetX = x;
        avatar.targetY = y;
        avatar.lastUpdate = Date.now();
      }
    },

    removeAvatar(state, action) {
      const id = action.payload;
      delete state.avatars[id];
    },

    clearAvatars(state) {
      state.avatars = {};
    },
  }
});

export const {
  setIdentity,
  replaceAvatars,
  upsertAvatar,
  updateAvatarPosition,
  removeAvatar,
  clearAvatars
} = presenceSlice.actions;

export default presenceSlice.reducer;
