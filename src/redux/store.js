import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./features/dashboardSlice";

// Creating Redux store
export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
});

export default store;