// globalSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hasSession: null, // Initial value
};

const session = createSlice({
  name: 'hasSession',
  initialState,
  reducers: {
    sethasSession: (state, action) => {
      state.hasSession = action.payload;
    },
    updateSession: (state, action) => {
      // Assuming action.payload contains the updated session data
      state.hasSession = { ...state.hasSession, ...action.payload };
    },
  },
});

export const { sethasSession,updateSession } = session.actions;

export default session.reducer;
