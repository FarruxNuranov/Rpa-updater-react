import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUsers } from "./usersApi";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await getUsers(params);
      const items = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
        ? data
        : [];
      const total =
        typeof data?.totalCount === "number"
          ? data.totalCount
          : typeof data?.total === "number"
          ? data.total
          : items.length;
      return { items, total, params };
    } catch (e) {
      return rejectWithValue(e.message || "Failed to load users");
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  paging: { skip: 0, take: 50 },
  sort: { prop: undefined, direction: undefined },
  filters: undefined,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const { items, total, params } = action.payload;
        state.items = items;
        state.total = total;
        state.paging = {
          skip: params?.skip ?? state.paging.skip,
          take: params?.take ?? state.paging.take,
        };
        state.sort = {
          prop: params?.sortPropName ?? state.sort.prop,
          direction: params?.sortDirection ?? state.sort.direction,
        };
        state.filters = params?.filteringExpression ?? state.filters;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to load users";
      });
  },
});

export default usersSlice.reducer;
