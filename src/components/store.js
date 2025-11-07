import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userslice";
import presenceReducer from "./map/presenceSlice";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { persistStore } from "redux-persist";

// Combine your reducers
const rootReducer = combineReducers({
  user: userReducer,
  presence: presenceReducer,
});

// Configure persistence
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // ✅ only persist the user slice
};

// Wrap root reducer with persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// Create the persistor
export const persistor = persistStore(store);