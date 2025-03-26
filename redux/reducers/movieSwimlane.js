import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {requestMovieSwimlane} from '../../src/api/api';

export const fetchHomePageDetails = createAsyncThunk(
  'swimlane/fetchHomePageDetails',
  async () => {
    const response = await requestMovieSwimlane();
    // console.log('response--->>>>>', JSON.stringify(response));
    return response;
  },
);

const initialState = {
  homePageDetails: null,
  isDataFromPersist: false,
  selectedMovieDetailHome: null,
};

const movieSlice = createSlice({
  name: 'swimlane',
  initialState,
  reducers: {
    setSelectedDetailHome: (state, action) => {
      state.selectedMovieDetailHome = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchHomePageDetails.fulfilled, (state, action) => {
      // console.log('action.payload---',action)
      state.homePageDetails = action.payload;
    });
  },
});

export const {setSelectedDetailHome} = movieSlice.actions;
export default movieSlice.reducer;

// Middleware to handle data persistence
// export const persistMovieDataMiddleware = store => next => action => {
//   const result = next(action);

//   if (action.type.startsWith('swimlane/') && action.type.endsWith('/fulfilled')) {
//     AsyncStorage.setItem('movieData', JSON.stringify(store.getState().movie));
//   }

//   return result;
// };
