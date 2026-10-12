import { getFeedsApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice, type SerializedError } from '@reduxjs/toolkit';

import { createOrder } from './order-slice';

import type { TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: SerializedError | null;
  profileOrders: TOrder[];
  profileOrdersLoading: boolean;
  profileOrdersError: SerializedError | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: null,
  profileOrders: [],
  profileOrdersLoading: true,
  profileOrdersError: null,
};

export const getFeeds = createAsyncThunk('feed/getFeeds', getFeedsApi);

export const getProfileOrders = createAsyncThunk('feed/getProfileOrders', getOrdersApi);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(getProfileOrders.pending, (state) => {
        state.profileOrdersLoading = true;
        state.profileOrdersError = null;
      })
      .addCase(getProfileOrders.fulfilled, (state, action) => {
        state.profileOrdersLoading = false;
        state.profileOrders = action.payload;
      })
      .addCase(getProfileOrders.rejected, (state, action) => {
        state.profileOrdersLoading = false;
        state.profileOrdersError = action.error;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders = [action.payload.order, ...state.orders];
        state.profileOrders = [action.payload.order, ...state.profileOrders];
        state.total += 1;
        state.totalToday += 1;
      });
  },
  selectors: {
    selectFeedOrders: (state) => state.orders,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday,
    selectFeedIsLoading: (state) => state.isLoading,
    selectFeedError: (state) => state.error,
    selectProfileOrders: (state) => state.profileOrders,
    selectProfileOrdersLoading: (state) => state.profileOrdersLoading,
    selectProfileOrdersError: (state) => state.profileOrdersError,
  },
});

export const {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedIsLoading,
  selectFeedError,
  selectProfileOrders,
  selectProfileOrdersLoading,
  selectProfileOrdersError,
} = feedSlice.selectors;

export default feedSlice.reducer;
