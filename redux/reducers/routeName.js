// globalSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  route: null, // Initial value
};

const route_name = createSlice({
  name: 'route',
  initialState,
  reducers: {
    setroute: (state, action) => {
      state.route = action.payload;
    },
  },
});

export const { setroute } = route_name.actions;

export default route_name.reducer;
