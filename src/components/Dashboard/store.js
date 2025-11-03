import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Dashboard/userslice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});