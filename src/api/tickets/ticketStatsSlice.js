import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTicketStatusStatsApi,
  fetchTicketCategoryStatsApi,
} from "./ticketStatsApi";

// 🔹 Общая статистика
export const fetchTicketStatusStatsThunk = createAsyncThunk(
  "ticketStats/fetchStatusStats",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTicketStatusStatsApi();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Статистика по категориям
export const fetchTicketCategoryStatsThunk = createAsyncThunk(
  "ticketStats/fetchCategoryStats",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTicketCategoryStatsApi();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const ticketStatsSlice = createSlice({
  name: "ticketStats",
  initialState: {
    statusStats: null, // данные с /status
    categoryStats: [], // данные с /category-status
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Общая статистика
      .addCase(fetchTicketStatusStatsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTicketStatusStatsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.statusStats = action.payload;
      })
      .addCase(fetchTicketStatusStatsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Категории
      .addCase(fetchTicketCategoryStatsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTicketCategoryStatsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryStats = action.payload;
      })
      .addCase(fetchTicketCategoryStatsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ticketStatsSlice.reducer;