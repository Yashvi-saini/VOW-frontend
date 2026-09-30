import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { userReducer } from "@/features/auth";
import { presenceReducer } from "@/features/map";
import { workspaceReducer } from "@/features/dashboard";
import { filesReducer } from "@/features/files";
import { teamReducer } from "@/features/chat";

const rootReducer = combineReducers({
  user: userReducer,
  presence: presenceReducer,
  workspace: workspaceReducer,
  files: filesReducer,
  team: teamReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "workspace"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);