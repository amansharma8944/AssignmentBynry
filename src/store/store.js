import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice";
// import userSlice from "./UserSlice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    // User:userSlice,
  },
});
