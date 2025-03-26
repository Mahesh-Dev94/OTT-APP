import {configureStore, createAction} from '@reduxjs/toolkit';
// import { persistReducer, persistStore,persistMiddleware } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import movieReducer from '../reducers/details';
import movieSwimlane from '../reducers/movieSwimlane';
import globalReducer from '../reducers/globalSlice';
import focusHeighlite from '../reducers/focusHeighlite';
import session from '../reducers/session';
import persistConfig from './persistConfig';
import {persistMovieDataMiddleware} from './middleware';
import {
  // persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import routeName from '../reducers/routeName';

const persistedMovieReducer = persistReducer(persistConfig, movieSwimlane);

// Create the Redux store
export const store = configureStore({
  reducer: {
    movie: movieReducer,
    swimlane: persistedMovieReducer,
    global: globalReducer,
    hasFocus:focusHeighlite,
    hasSession:session,
    route:routeName
    // Add your other reducers here
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(persistMovieDataMiddleware),
  devTools: true,
  // Disable non-serializable value checks
  nonSerializableCheck: {ignoredPaths: ['swimlane.homePageDetails']},
});

// Create the persistor
// GETTING ERROR ON APPLE TV USING PERSIST AS ASYNC STORAGE NOT SUPPORTED ON APPLE TV
// export const persistor = persistStore(store);
