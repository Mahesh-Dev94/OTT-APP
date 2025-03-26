// redux/persistConfig.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root', // Change this to a unique key for your app
  storage: AsyncStorage, // Change to 'localStorage' for web
  whitelist: ['swimlane'], // Array of reducer slices to persist
};

export default persistConfig;