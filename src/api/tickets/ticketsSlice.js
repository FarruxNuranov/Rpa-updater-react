import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTicketsApi, updateTicketStatusApi, assignTicketApi } from "./ticketsApi";
import { message } from "antd";

// 🔹 Получить все тикеты
export const fetchTicketsThunk = createAsyncThunk(
  "tickets/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchTicketsApi();

      // Если API возвращает структуру { items, totalCount, ... }
      if (Array.isArray(data?.items)) return data.items;

      // Если вернулся массив напрямую
      if (Array.isArray(data)) return data;

      return [];
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch tickets");
    }
  }
);

// 🔹 Назначить тикет на текущего пользователя
export const assignTicketThunk = createAsyncThunk(
  "tickets/assign",
  async (id, { rejectWithValue }) => {
    try {
      await assignTicketApi(id);
      return { id };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to assign ticket");
    }
  }
);

// 🔹 Обновить статус тикета
export const updateTicketStatusThunk = createAsyncThunk(
  "tickets/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await updateTicketStatusApi(id, status);
      message.success("✅ Ticket status updated!");
      return { id, status };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update ticket");
    }
  }
);

const ticketsSlice = createSlice({
  name: "tickets",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // ✅ Мгновенное (локальное) обновление статуса
    updateTicketStatusLocal: (state, action) => {
      const { id, status } = action.payload;
      const ticket = state.items.find((t) => t.id === id);
      if (ticket) ticket.status = status;
    },
    // ✅ Добавить новый тикет, если его ещё нет
    addTicket: (state, action) => {
      const t = action.payload;
      if (!t || !t.id) return;
      const exists = state.items.some((x) => x.id === t.id);
      if (!exists) {
        state.items.unshift(t);
      }
    },
    // ✅ Патч полей тикета (status/department/priority ...)
    updateTicketFields: (state, action) => {
      const { id, ...patch } = action.payload || {};
      if (!id) return;
      const t = state.items.find((x) => x.id === id);
      if (t) {
        Object.assign(t, patch);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // === FETCH ===
      .addCase(fetchTicketsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketsThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Убираем возможные дубликаты по id
        state.items = action.payload.filter(
          (v, i, a) => a.findIndex((x) => x.id === v.id) === i
        );
      })
      .addCase(fetchTicketsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === UPDATE ===
      .addCase(updateTicketStatusThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTicketStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status } = action.payload;
        const ticket = state.items.find((t) => t.id === id);
        if (ticket) ticket.status = status;
      })
      .addCase(updateTicketStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateTicketStatusLocal, addTicket, updateTicketFields } = ticketsSlice.actions;
export default ticketsSlice.reducer;