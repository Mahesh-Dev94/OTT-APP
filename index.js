/**
 * @format
 */

import {AppRegistry,LogBox, Platform} from 'react-native';
import App from './App'   //'./App';
import {name as appName} from './app.json';
import 'react-native/tvos-types.d';

import { decode } from "base-64";
global.atob = decode;
var keyeventremote;
var keyevent;
// Conditionally import TV-specific modules
if (Platform.isTV || Platform.OS === 'web') {
  keyeventremote =require('./src1/components/configureRemoteControl');    //require('./src/TVComponents/components/configureRemoteControl');
  keyevent = require('react-native-keyevent');
} 

LogBox.ignoreLogs([
  'Each child in a list should have a unique "key" prop.',
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
  'RCTBridge required dispatch_sync to load RNGestureHandlerModule. This may lead to deadlocks',
  'Non-serializable values were found in the navigation state',
  'Persistent storage is not supported on tvOS, your data may be removed at any point',
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.',
]);

AppRegistry.registerComponent(appName, () => App);
