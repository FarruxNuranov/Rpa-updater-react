import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getNotifications, markRead as apiMarkRead, markAllRead as apiMarkAllRead } from "./notificationsApi";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await getNotifications(params);
      const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      const total = typeof data?.totalCount === "number"
        ? data.totalCount
        : typeof data?.total === "number"
          ? data.total
          : items.length;
      return { items, total, params };
    } catch (e) {
      return rejectWithValue(e.message || "Failed to load notifications");
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id, { rejectWithValue }) => {
    try {
      await apiMarkRead(id);
      return id;
    } catch (e) {
      return rejectWithValue(e.message || "Failed to mark read");
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await apiMarkAllRead();
      return true;
    } catch (e) {
      return rejectWithValue(e.message || "Failed to mark all read");
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  unreadCount: 0,
  loading: false,
  error: null,
  paging: { skip: 0, take: 100 },
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addIncoming(state, action) {
      const payload = action.payload || {};
      const item = {
        id: payload.id || `${Date.now()}_${Math.random()}`,
        read: Boolean(payload.isRead ?? payload.read ?? false),
        ...payload,
      };
      state.items = [item, ...state.items];
      state.total += 1;
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const { items, total, params } = action.payload;
        state.items = items.map((n) => ({ read: Boolean(n.isRead ?? n.read), ...n }));
        state.total = total;
        state.unreadCount = state.items.filter((n) => !n.read).length;
        state.paging = {
          skip: params?.skip ?? state.paging.skip,
          take: params?.take ?? state.paging.take,
        };
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to load notifications";
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.map((n) => (n.id === id ? { ...n, read: true } : n));
        state.unreadCount = state.items.filter((n) => !n.read).length;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, read: true }));
        state.unreadCount = 0;
      });
  },
});

export const { addIncoming } = notificationsSlice.actions;
export default notificationsSlice.reducer;
