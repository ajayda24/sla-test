import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import DashboardData from "./Api/DashboardData";
import userManagement from "./Api/userManagement";
import roleManagement from "./Api/roleManagement";

export const store = configureStore({
  reducer: {
    user: userSlice,
    dashboardData: DashboardData,
    userManagement: userManagement,
    roleManagement: roleManagement,
  },
});
