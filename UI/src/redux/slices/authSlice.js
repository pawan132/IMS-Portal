import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
  user_id: localStorage.getItem("user_id") ? localStorage.getItem("user_id") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
  },
});

export const { setLoading, setToken, setUser } = authSlice.actions;

export default authSlice.reducer;