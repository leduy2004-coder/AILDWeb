import { createSlice } from '@reduxjs/toolkit';

type CounterState = {
  isLoading: boolean;
};

const initialState: CounterState = {
  isLoading: false,
};

export const loadingIndicator = createSlice({
  name: 'loadingIndicator',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
  },
});

export const { showLoading, hideLoading } = loadingIndicator.actions;
export default loadingIndicator.reducer;
