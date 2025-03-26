// actions/movieActions.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {requestMovieDetails} from '../../src/api/api';

export const fetchMovieDetailScreen = createAsyncThunk(
  'movie/fetchMovieDetailScreen',
  async ({id, type = false, details = undefined}) => {
    if (details) {
      const daa = {
        movieData: {...details, url: details.overview},
      };
      return daa;
    }
    const response = await requestMovieDetails(id, type);
    return response;
  },
);

const movieSlice = createSlice({
  name: 'movie',
  initialState: {
    detail: null,
    homePosterDetail: null,
    /**
     * @initialValue
     * as there is only onbe detail page which can be pushed into stack to display another data in same
     */
    movieDetailData: [],
  },
  reducers: {
    setDetailReducer: (state, action) => {
      state.detail = action.payload;
    },
    clearMovieDetailData: state => {
      state.movieDetailData = [];
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchMovieDetailScreen.fulfilled, (state, action) => {
      state.detail = action.payload;
      if (state.movieDetailData.length > 0) {
        const isIdFound = state.movieDetailData.find(
          data => data.movieData.id === action.payload.movieData.id,
        );
        if (isIdFound === undefined) {
          state.movieDetailData = [...state.movieDetailData, action.payload];
        }
      } else {
        state.movieDetailData = [action.payload];
      }
    });
  },
});
export const {setDetailReducer, clearMovieDetailData} = movieSlice.actions;

export default movieSlice.reducer;
