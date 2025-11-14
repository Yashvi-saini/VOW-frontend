import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  avatars: {},
  selfId: null,
  workspaceId: null,
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
      state.avatars = {};
      const avatars = action.payload;
      avatars.forEach(avatar => {
        if (avatar.userId !== state.selfId) {
          state.avatars[avatar.userId] = {
            userId: avatar.userId,
            name: avatar.name,
            x: avatar.x || 50,
            y: avatar.y || 50,
            targetX: avatar.x || 50,
            targetY: avatar.y || 50,
            lastUpdate: Date.now()
          };
        }
      });
    },
    
    upsertAvatar(state, action) {
      const avatar = action.payload;
      if (avatar.userId === state.selfId) return;
      
      const existing = state.avatars[avatar.userId];
      state.avatars[avatar.userId] = {
        userId: avatar.userId,
        name: avatar.name,
        x: existing?.x || avatar.x || 50,
        y: existing?.y || avatar.y || 50,
        targetX: avatar.x || 50,
        targetY: avatar.y || 50,
        lastUpdate: Date.now()
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
      const userId = action.payload;
      delete state.avatars[userId];
    },
    
    clearAvatars(state) {
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
  clearAvatars
} = presenceSlice.actions;

export default presenceSlice.reducer;
