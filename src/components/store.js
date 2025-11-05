import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userslice";
import workspaceReducer from "../components/userslice";
import filesReducer from "./dashboard/filesSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    workspace: workspaceReducer,
    files: filesReducer,
  },
});


