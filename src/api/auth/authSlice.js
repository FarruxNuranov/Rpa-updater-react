import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "./authApi";

// 🔹 Асинхронный thunk для логина
export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await loginApi({ email, password });

      // сохраняем токен и дату истечения
      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("expireDate", res.expireDate);

      return res;
    } catch (err) {
      return rejectWithValue(err.message || "Ошибка авторизации");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    expireDate: localStorage.getItem("expireDate") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.expireDate = null;
      localStorage.removeItem("token");
      localStorage.removeItem("expireDate");
    },
    setAuth: (state, action) => {
      const { accessToken, expireDate } = action.payload || {};
      state.token = accessToken || null;
      state.expireDate = expireDate || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken;
        state.expireDate = action.payload.expireDate;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setAuth } = authSlice.actions;
export default authSlice.reducer;