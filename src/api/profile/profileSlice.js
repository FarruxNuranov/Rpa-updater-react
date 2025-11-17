import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProfileApi, updateProfileApi, changePasswordApi } from "./profileApi";

// === Thunk для получения профиля ===
export const fetchProfileThunk = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchProfileApi();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch profile");
    }
  }
);

// === Thunk для обновления профиля ===
export const updateProfileThunk = createAsyncThunk(
  "profile/update",
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await updateProfileApi(profileData);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update profile");
    }
  }
);

// === Thunk для смены пароля ===
export const changePasswordThunk = createAsyncThunk(
  "profile/changePassword",
  async (password, { rejectWithValue }) => {
    try {
      const data = await changePasswordApi(password);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to change password");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    loading: false,
    updating: false,
    error: null,
    data: null, // { id, firstName, lastName, email, avatarUrl, createdAt, updatedAt }
  },
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch profile";
      })
      // Update profile
      .addCase(updateProfileThunk.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.updating = false;
        state.data = action.payload;
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || "Failed to update profile";
      })
      // Change password
      .addCase(changePasswordThunk.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || "Failed to change password";
      });
  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
