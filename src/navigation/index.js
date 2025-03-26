import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
} from '@react-navigation/stack';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SignInScreen from '../authentication/screens/SignInScreen';
import SignInQrGoogleScreen from '../authentication/screens/SignInScreen/SignInWithQrCodeGoogle';
import SignInQrFacebookScreen from '../authentication/screens/SignInScreen/SignInWithQrCodeFacebook';

import UpdateProfileScreen from '../authentication/screens/UpdateProfile';
import ConfirmEmailScreen from '../authentication/screens/ConfirmEmailScreen';
import ForgotPasswordScreen from '../authentication/screens/ForgotPasswordScreen';
// import NewPasswordScreen from '../authentication/screens/NewPasswordScreen';

import MovieDetailScreenNew from '../screen/MovieDetailScreen';

import OfflineNotice from '../component/OfflineNotice';
import Player from '../screen/Player/index';
import MovieCastDetail from '../screen/MovieCastDetail'
import MovieSearch from '../screen/MovieSearch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import Orientation from 'react-native-orientation-locker';
import { VolumeManager } from 'react-native-volume-manager';
import HomeDrawerNavigator from "../navigator/HomeDrawerNavigator";
import MovieScreen from '../screen/MovieScreen';
import { ThemeProvider } from '@emotion/react';
import { useWindowDimensions } from 'react-native';
import styled from '@emotion/native';
import { sethasSession } from '../../redux/reducers/session';
import alert from '../component/Utils/alert';
import { SpatialNavigationDeviceTypeProvider } from 'react-tv-space-navigation';
import { MenuProvider, useMenuContext } from '../../src1/components/Menu/MenuContext';
import { Menu } from '../../src1/components/Menu/Menu';
import { theme } from '../../src1/design-system/theme/theme';
import { GoBackConfiguration } from '../../src1/components/GoBackConfiguration';
import { useTVPanEvent } from '../../src1/components/PanEvent/useTVPanEvent';
import MemoizedRenderMenu from './renderMenu';

const isWider = Platform.isTV || Platform.OS === 'web'
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Navigation = () => {
  const dispatch = useDispatch();
  // const session = useSelector(state => state.hasSession.hasSession);
  useTVPanEvent();
  const {height, width} = useWindowDimensions();
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData();
      // setUser(data);
      dispatch(sethasSession(data));
    };

    fetchUserData();
  }, [dispatch]);

  const getUserData = async () => {
    try {

      const userData = await AsyncStorage.getItem('user');

      let loggedUser = userData ? JSON.parse(userData) : null;

      let currentTime = new Date().getTime()
      console.log('loggedUser---', currentTime, '---', loggedUser?.TokenExpireIn)
      if (loggedUser) {
        if (currentTime > loggedUser?.TokenExpireIn) {
          console.log('userData---', 'Expired !!!!!')
          await AsyncStorage.removeItem('user');
          dispatch(sethasSession(null));
          alert('Session Expired !!!', 'Please login again! ');
          return null;
        } else {
          return loggedUser;
        }
      } else {
        return null
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  };

  const linking = {
    prefixes: ['http://localhost:8080'],
    config: {
      screens: {
        Home: '/Home',
        Movielist: 'Movielist/',
        MovieDetail: 'MovieDetail/',
        MoviePlayer: 'MoviePlayer/',
        Player: 'Player/',
        MovieCastDetail: 'MovieCastDetail/',
        SignIn: 'SignIn/',
        ConfirmEmail: 'ConfirmEmail/',
        UpdateProfile: 'UpdateProfile/',
        MovieSearch: 'MovieSearch/',
      },
  
      /* configuration for matching screens with paths */
    },
  };


  const TabNavigator = () => {
    const {isOpen: isMenuOpen, toggleMenu} = useMenuContext();
    console.log('isMenuOpen--',isMenuOpen)
    return (
      <MenuProvider>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="Home"
          // tabBar={RenderMenu}
          tabBar={(props) => <MemoizedRenderMenu {...props} />}
          
          sceneContainerStyle={{
            paddingLeft: theme.sizes.menu.closed,
            backgroundColor:isMenuOpen ?theme.colors.background.main+99:theme.colors.background.main,
          }}
          >
          <Tab.Screen name="Home" component={MovieScreen} />
          <Tab.Screen name="MovieSearch" component={MovieSearch} />
          <Tab.Screen name="UpdateProfile" component={UpdateProfileScreen} />
        </Tab.Navigator>
      </MenuProvider>
    );
  };



  return (
    <NavigationContainer linking={linking}>
    {isWider ? (
      <ThemeProvider theme={theme} >
        <SpatialNavigationDeviceTypeProvider>
          <GoBackConfiguration />

          <Container width={width} height={height}>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor:theme.colors.background.main,
                },
              }}
              initialRouteName="TabNavigator">
              <Stack.Screen name="TabNavigator" component={TabNavigator} />
              <Stack.Screen name="MovieDetail" component={MovieDetailScreenNew} />
              <Stack.Screen name="Player" component={Player} />
              <Stack.Screen
                name="MovieCastDetail"
                component={MovieCastDetail}
              />
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen
                name="ConfirmEmail"
                component={ConfirmEmailScreen}
              />
            </Stack.Navigator>
          </Container>
        </SpatialNavigationDeviceTypeProvider>
      </ThemeProvider>
    ) : (
      <AppNavigator />
    )}
    <OfflineNotice />
  </NavigationContainer>
  );
};

const RenderMenu = (props) => <Menu {...props} />;

// Navigator for the app screens
const AppNavigator = React.memo(() => {
  React.useEffect(() => {
    if (!Platform.isTV && Platform.OS !== 'web') {
      Orientation.lockToPortrait();
      Platform.OS === 'ios' && VolumeManager.enable(true, true); // Enable async
      // VolumeManager.showNativeVolumeUI({ enabled: true });
    }
  }, []);
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitle: '',
        headerTransparent: true,
        headerBackTitleVisible: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="Home"
        component={HomeDrawerNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreenNew} />
      <Stack.Screen name="Player" component={Player} />
      <Stack.Screen name="MovieCastDetail" component={MovieCastDetail} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
      <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
      <Stack.Screen name="MovieSearch" component={MovieSearch} />
    </Stack.Navigator>
  );
});


export default Navigation;


const Container = styled.View(({ width, height }) => ({
  width,
  height,
  flexDirection: 'row-reverse',
  backgroundColor: '#000000'
}));