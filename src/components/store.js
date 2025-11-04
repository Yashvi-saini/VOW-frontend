import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userslice";
import workspaceReducer from "../components/userslice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    workspace: workspaceReducer,
  },
});
// store/index.js

