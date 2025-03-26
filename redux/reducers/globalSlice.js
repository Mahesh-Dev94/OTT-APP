// globalSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  globalID: null, // Initial value
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setGlobalID: (state, action) => {
      state.globalID = action.payload;
    },
  },
});

export const { setGlobalID } = globalSlice.actions;

export default globalSlice.reducer;
