import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  dashboardPage: "Dashboard",
  appErrors: [],
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state = action.payload;
    },
    setPage: (state, action) => {
      state.dashboardPage = action.payload;
    },
    setAppError: (state, action) => {
      state.appErrors.push({
        ...action.payload,
        id: Math.floor(Math.random() * Date.now()),
      });
      if (state.appErrors.length > 5) {
        state.appErrors.shift();
      }
    },
    removeAppError: (state, action) => {
      const errors = state.appErrors.filter((e) => e.id !== action.payload);
      state.appErrors = errors;
    },
  },
});

export const { setUser, setPage, setAppError, removeAppError } = authSlice.actions;

export default authSlice.reducer;
