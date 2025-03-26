// middleware.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAction } from '@reduxjs/toolkit';

export const persistMovieData = createAction('persistMovieData');

export const persistMovieDataMiddleware = store => next => action => {
	// Exclude internal Redux Persist actions
	// console.log('action-----',action)
	if (action.type === 'persist/PERSIST' || action.type === 'persist/REHYDRATE') {
	  return next(action);
	}
  
	// Check if the action should be persisted
	if (action.type === persistMovieData.type) {
	  const { swimlane } = store.getState(); // Replace with your reducer name
	  AsyncStorage.setItem('persistedMovieData', JSON.stringify(swimlane));
	}
  
	return next(action);
  };