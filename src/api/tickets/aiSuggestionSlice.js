import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { askAiApi, fetchAiHistoryApi } from "./aiSuggestionApi";

// 🔹 Thunk для обращения к AI
export const askAiThunk = createAsyncThunk(
  "aiSuggestion/ask",
  async ({ prompt, ticketId, userId }, { rejectWithValue }) => {
    try {
      const data = await askAiApi({ prompt, ticketId, userId });

      const message = {
        id: Date.now(),
        prompt,
        response: data.response,
        suggestions: data.suggestions,
        timestamp: new Date().toISOString(),
      };

      return message;
    } catch (error) {
      console.error("❌ AI API error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Thunk для получения истории AI по тикету
export const fetchAiHistoryThunk = createAsyncThunk(
  "aiSuggestion/fetchHistory",
  async (ticketId, { rejectWithValue }) => {
    try {
      const data = await fetchAiHistoryApi(ticketId);
      
      // API returns { items: [...], totalCount, ... }
      const items = data?.items || [];
      
      // Transform API format to our internal format
      const messages = items.map((item) => ({
        id: item.id || Date.now(),
        prompt: item.question || "",
        response: item.answer || "",
        suggestions: [], // API doesn't return suggestions in history
        timestamp: item.createdAt || new Date().toISOString(),
      }));
      
      return messages;
    } catch (error) {
      console.error("❌ Fetch AI history error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const aiSuggestionSlice = createSlice({
  name: "aiSuggestion",
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAiHistory: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askAiThunk.pending, (state, action) => {
        state.loading = true;
        const prompt = action.meta?.arg?.prompt || "";
        // Optimistic user message (no response yet)
        state.messages.push({
          id: Date.now(),
          prompt,
          response: null,
          suggestions: [],
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(askAiThunk.fulfilled, (state, action) => {
        state.loading = false;
        const prompt = action.meta?.arg?.prompt || action.payload?.prompt;
        // Replace the latest pending message with the resolved one
        const idx = [...state.messages]
          .reverse()
          .findIndex((m) => m.response === null && m.prompt === prompt);
        const realIdx = idx >= 0 ? state.messages.length - 1 - idx : -1;
        if (realIdx >= 0) {
          state.messages[realIdx] = action.payload;
        } else {
          state.messages.push(action.payload);
        }
      })
      .addCase(askAiThunk.rejected, (state, action) => {
        state.loading = false;
        const prompt = action.meta?.arg?.prompt || "";
        // Remove latest pending message for this prompt if exists
        const idx = [...state.messages]
          .reverse()
          .findIndex((m) => m.response === null && m.prompt === prompt);
        const realIdx = idx >= 0 ? state.messages.length - 1 - idx : -1;
        if (realIdx >= 0) state.messages.splice(realIdx, 1);
        state.error = action.payload;
      })
      // Fetch AI history
      .addCase(fetchAiHistoryThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAiHistoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchAiHistoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAiHistory } = aiSuggestionSlice.actions;
export default aiSuggestionSlice.reducer;