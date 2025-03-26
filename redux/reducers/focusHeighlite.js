// globalSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hasFocus: null, // Initial value
};

const focusHeighlite = createSlice({
  name: 'hasFocus',
  initialState,
  reducers: {
    sethasFocus: (state, action) => {
      state.hasFocus = action.payload;
    },
  },
});

export const { sethasFocus } = focusHeighlite.actions;

export default focusHeighlite.reducer;
