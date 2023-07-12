import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../Global/axios";

let token = localStorage.getItem("token");

const getDashbaordData = createAsyncThunk("api/data", async (token) => {
  try {
    const response = await axios.get("/dashboard/data", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
});

const DashboardDataSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: null,
    error: "",
    status: false,
    isloading: false,
  },
  extraReducers: {
    [getDashbaordData.fulfilled]: (state, action) => {
      state.isloading = false;
      state.data = action.payload.data;
      state.status = true;
    },
    [getDashbaordData.pending]: (state, action) => {
      state.isloading = true;
    },
    [getDashbaordData.rejected]: (state, action) => {
      state.isloading = false;
      state.error = "Something Error Occur!";
    },
  },
});

export { getDashbaordData };

export default DashboardDataSlice.reducer;
