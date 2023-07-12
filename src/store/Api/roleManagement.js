import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../Global/axios";

let token = localStorage.getItem("token");

const getRoleList = createAsyncThunk("api/roleList", async () => {
  try {
    if (token) {
      const response = await axios.get("/dashboard/roles", {
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

const getPermissionList = createAsyncThunk("api/permissionlist", async () => {
  try {
    if (token) {
      const response = await axios.get("/dashboard/permissions-list", {
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

const roleManagementSlice = createSlice({
  name: "roleManagement",
  initialState: {
    lists: [],
    permissionLists: [],
    error: "",
    isloading: false,
  },
  extraReducers: {
    // User list API call reducers
    [getRoleList.fulfilled]: (state, action) => {
      state.isloading = false;
      state.lists = action.payload.data;
    },
    [getRoleList.pending]: (state, action) => {
      state.isloading = true;
    },
    [getRoleList.rejected]: (state, action) => {
      state.isloading = false;
      state.error = "Something Error Occur!";
    },
    // permission list API call reducers
    // User list API call reducers
    [getPermissionList.fulfilled]: (state, action) => {
      state.isloading = false;
      state.permissionLists = action.payload.data;
    },
    [getPermissionList.pending]: (state, action) => {
      state.isloading = true;
    },
    [getPermissionList.rejected]: (state, action) => {
      state.isloading = false;
      state.error = "Something Error Occur!";
    },
  },
});

export { getRoleList, getPermissionList };

export default roleManagementSlice.reducer;
