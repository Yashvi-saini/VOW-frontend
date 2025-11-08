import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import userReducer from "./userslice";
import workspaceReducer from "./userslice"; 
import filesReducer from "./dashboard/filesSlice";
import presenceReducer from "./map/presenceSlice";


const rootReducer = combineReducers({
  user: userReducer,
  workspace: workspaceReducer,
  files: filesReducer,
  presence: presenceReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], 
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



