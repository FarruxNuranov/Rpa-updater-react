import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadFileApi } from "./filesApi";

// === Thunk для загрузки файла ===
export const uploadFileThunk = createAsyncThunk(
  "files/upload",
  async ({ file, language = "uz" }, { rejectWithValue }) => {
    try {
      const data = await uploadFileApi(file, language);
      return data; // { fileName, url }
    } catch (err) {
      return rejectWithValue(err.message || "Upload failed");
    }
  }
);

const filesSlice = createSlice({
  name: "files",
  initialState: {
    loading: false,
    error: null,
    uploadedFile: null, // { fileName, url }
  },
  reducers: {
    clearUploadedFile: (state) => {
      state.uploadedFile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadedFile = action.payload;
      })
      .addCase(uploadFileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Upload failed";
      });
  },
});

export const { clearUploadedFile } = filesSlice.actions;
export default filesSlice.reducer;
