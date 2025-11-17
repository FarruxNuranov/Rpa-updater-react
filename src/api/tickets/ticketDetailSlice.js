import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchTicketByIdApi, updateTicketByIdApi, updateTicketDepartmentApi, updateTicketPriorityApi } from "./ticketDetailApi";

// 🔹 Получить тикет по ID
export const fetchTicketByIdThunk = createAsyncThunk(
  "ticketDetail/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await fetchTicketByIdApi(id);
    
      return data;
    } catch (error) {
      console.error("❌ API error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Обновить тикет по ID
export const updateTicketByIdThunk = createAsyncThunk(
  "ticketDetail/updateById",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await updateTicketByIdApi(id, data);
      console.log("✅ Ticket updated:", result);
      return result;
    } catch (error) {
      console.error("❌ Update API error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Обновить департамент тикета
export const updateTicketDepartmentThunk = createAsyncThunk(
  "ticketDetail/updateDepartment",
  async ({ id, department }, { rejectWithValue }) => {
    try {
      const result = await updateTicketDepartmentApi(id, department);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Обновить приоритет тикета
export const updateTicketPriorityThunk = createAsyncThunk(
  "ticketDetail/updatePriority",
  async ({ id, priority }, { rejectWithValue }) => {
    try {
      const result = await updateTicketPriorityApi(id, priority);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const ticketDetailSlice = createSlice({
  name: "ticketDetail",
  initialState: {
    ticket: null,
    loading: false,
    updating: false,
    error: null,
  },
  reducers: {
    clearTicket: (state) => {
      state.ticket = null;
      state.error = null;
      state.loading = false;
      state.updating = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch
      .addCase(fetchTicketByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTicketByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.ticket = action.payload;
      })
      .addCase(fetchTicketByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Update
      .addCase(updateTicketByIdThunk.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateTicketByIdThunk.fulfilled, (state, action) => {
        state.updating = false;
        state.ticket = action.payload; // обновляем state
      })
      .addCase(updateTicketByIdThunk.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // 🔹 Update Department
      .addCase(updateTicketDepartmentThunk.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateTicketDepartmentThunk.fulfilled, (state, action) => {
        state.updating = false;
        state.ticket = action.payload;
      })
      .addCase(updateTicketDepartmentThunk.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // 🔹 Update Priority
      .addCase(updateTicketPriorityThunk.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateTicketPriorityThunk.fulfilled, (state, action) => {
        state.updating = false;
        state.ticket = action.payload;
      })
      .addCase(updateTicketPriorityThunk.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export const { clearTicket } = ticketDetailSlice.actions;
export default ticketDetailSlice.reducer;