import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../Global/axios";

let token = localStorage.getItem("token");

const getUserLists = createAsyncThunk("api/usermanagement", async () => {
  try {
    if (token) {
      const response = await axios.get("/dashboard/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState: {
    lists: null,
    error: "",
    isloading: false,
  },
  extraReducers: {
    [getUserLists.fulfilled]: (state, action) => {
      state.isloading = false;
      console.log(action.payload.data);
      //   state.list = action.payload.data;
    },
    [getUserLists.pending]: (state, action) => {
      state.isloading = true;
    },
    [getUserLists.rejected]: (state, action) => {
      state.isloading = false;
      state.error = "Something Error Occur!";
    },
  },
});

export { getUserLists };

export default userManagementSlice.reducer;
