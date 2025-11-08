import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import userReducer from "./userslice";
import presenceReducer from "./map/presenceSlice";
import workspaceReducer from "./userslice"; 
import filesReducer from "./dashboard/filesSlice";
import teamReducer from "./chat/teamslices";


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



