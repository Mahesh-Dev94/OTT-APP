import {Direction} from '@bam.tech/lrud';
import {
  DefaultFocus,
  SpatialNavigationFocusableView,
  SpatialNavigationRoot,
  SpatialNavigationView,
} from 'react-tv-space-navigation';
import {useMenuContext} from './MenuContext';
import {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Image, Platform, View, Text} from 'react-native';
import styled from '@emotion/native';
import {Typography} from '../../design-system/components/Typography';
import {Spacer} from '../../design-system/components/Spacer';
import {Box} from '../../design-system/components/Box';
import {useTheme} from '@emotion/react';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {MenuButton} from './MenuButton';
import {IconName} from '../../design-system/helpers/IconsCatalog';
import {RootTabParamList} from '../../../App';
import React from 'react';
import {scaledPixels} from '../../design-system/helpers/scaledPixels';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {sethasSession} from '../../../redux/reducers/session';
import {signOut,fetchAuthSession} from 'aws-amplify/auth';
import {useDispatch, useSelector} from 'react-redux';

const windowDimensions = Dimensions.get('window');
const MenuItem = ({
  label,
  icon,
  isMenuOpen,
  isActive,
  onSelect,
}: {
  label: string;
  icon: IconName;
  isMenuOpen: boolean;
  isActive: boolean;
  onSelect: () => void;
}) => {
  return (
    <Box direction="horizontal" alignItems="center">
      <ActiveIndicator isActive={isActive} />
      <MenuButton
        icon={icon}
        onSelect={() => onSelect()}
        isMenuOpen={isMenuOpen}
      />
      {isMenuOpen && (
        <>
          <Spacer direction="horizontal" gap="$2" />
          <Typography>{label}</Typography>
        </>
      )}
    </Box>
  );
};

interface MenuItems {
  label: string;
  icon: IconName;
}

// export type RootTabParamList = {
//   Home: undefined;
//   MovieSearch: undefined;
//   MovieDetail: undefined;
//   UpdateProfile: undefined;
// };

// const menuItems: Record<keyof RootTabParamList, MenuItems> = {
//   Home: {label: 'Homepage', icon: 'Home'},
//   MovieSearch: {label: 'MovieSearch', icon: 'Search'},

//   // ProgramGridPage: { label: 'Virtualized Grid', icon: 'Grid3X3' },
//   // NonVirtualizedGridPage: { label: 'Non-virtualized Grid', icon: 'LayoutGrid' },
//   // GridWithLongNodesPage: {
//   //   label: 'Grid with long nodes',
//   //   icon: 'LayoutDashboard',
//   // },
// };

export const Menu = ({state, navigation}: BottomTabBarProps) => {
  const {isOpen: isMenuOpen, toggleMenu} = useMenuContext();
  const theme = useTheme();
  const dispatch = useDispatch();
  const session = useSelector((state: any) => state.hasSession.hasSession);
  const [logo, setLogo] = useState('');
  const [userName, setUserName] = useState('');
  const animatedWidth = useRef(
    new Animated.Value(
      isMenuOpen ? theme.sizes.menu.open : theme.sizes.menu.closed,
    ),
  ).current;
  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      if (movement === 'right') {
        toggleMenu(false);
      }
    },
    [toggleMenu],
  );

  const menuWebProps = Platform.select({
    web: {
      onMouseEnter: () => {
        toggleMenu(true);
      },
      onMouseLeave: () => {
        toggleMenu(false);
      },
    },
    default: {},
  });

  useEffect(() => {
    if (session) {
      console.log('session---', session);
      setUserName(
        session.user?.name ? session.user?.name : session.user?.email,
      );
      setLogo(session.user?.picture);
    } else {
      setUserName('');
      setLogo('');
    }
  }, [session]);

  const resetAndNavigateToFirstScreen = () => {
    if (state.index === 0) {
      navigation.goBack();
    } else {
      navigation.goBack();
    }
  };

  const LogOut = useCallback(async () => {
    await AsyncStorage.removeItem('user');
    dispatch(sethasSession(null));
    if (Platform.OS === 'web') await signOut();
  
  }, [dispatch]);

  const UserLogin = useCallback(() => {
    navigation.navigate('SignIn');
    toggleMenu(false);
  }, [navigation, toggleMenu]);

  const _onProfileUpdate = useCallback(() => {
    if (session) {
      navigation.navigate('UpdateProfile');
      toggleMenu(false);
    }
  }, [session, navigation, toggleMenu]);


  useEffect(()=>{
    if (Platform.OS==='web' && !session) {
      getUserInfo()
    }
   
   },[])
  
  
   const getUserInfo = async () => {
    try {
      var cognitoTokens = (await fetchAuthSession()).tokens;
      console.log('cognitoTokens--',cognitoTokens)
      if(cognitoTokens){
        let rawToken = cognitoTokens?.idToken?.toString();
        let payload = cognitoTokens?.idToken?.payload;
        
         let userData={
           'user':payload,
           'AccessToken':rawToken,
           'TokenExpireIn': payload?.exp? (payload?.exp * 1000):(new Date().getTime() + 3600000 )
         }
         
         console.log('userData--',userData)
         await AsyncStorage.setItem('user', JSON.stringify(userData));
         dispatch(sethasSession(userData));
      }
    } catch (error) {
      console.error(error);
      console.log('Not signed in');
    }
  };

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: isMenuOpen ? theme.sizes.menu.open : theme.sizes.menu.closed,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [
    animatedWidth,
    isMenuOpen,
    theme.sizes.menu.closed,
    theme.sizes.menu.open,
  ]);

  // console.log('--------', state.index, state.routes['Home'] === 'Home');
  return (
    <SpatialNavigationRoot
      isActive={isMenuOpen}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
      <AbsoluteMenuContainer>
        <SpatialNavigationView direction="vertical">
          <MenuSpacer />
          <MenuOverlay style={{width: animatedWidth}} />
          <MenuContainer isOpen={isMenuOpen} {...menuWebProps}>
            <DefaultFocus>
              <View>
                {/* {state.routes.map((route, index) => {
                  console.log(route, index) */}
                {/* return ( */}
                <Fragment>
                <Spacer direction="vertical" gap={'$20'} />
                <Spacer direction="vertical" gap={'$20'} />
                  <SpatialNavigationFocusableView
                    onSelect={() => _onProfileUpdate()}
                    // isFocusable={true}
                    >
                    {({isFocused}) => (
                      <View
                        style={{
                          alignSelf: 'flex-start',
                          alignItems: 'flex-start',
                        }}>
                        <View
                          style={{
                            height: isMenuOpen
                              ? scaledPixels(140)
                              : scaledPixels(70),
                            width: isMenuOpen
                              ? scaledPixels(140)
                              : scaledPixels(70),
                            overflow: 'hidden',
                            borderRadius: isMenuOpen
                              ? scaledPixels(140)
                              : scaledPixels(70),
                            borderColor:
                              isMenuOpen && isFocused ? 'white' : 'gray',
                            borderWidth: 2,
                          }}>
                          <ProgramImage
                            source={
                              logo
                                ? {uri: logo}
                                : require('../../modules/program/assets/rabbit5.png')
                            }
                          />
                        </View>
                        {isMenuOpen && <Spacer direction="vertical" gap="$5" />}
                        {isMenuOpen && (
                          // <Typography
                          //   style={{
                          //     fontSize:
                          //       userName.length > 8
                          //         ? scaledPixels(20)
                          //         : scaledPixels(25),
                          //     alignItems: 'center',
                          //     alignSelf: 'center',
                          //     width: userName.length > 8
                          //     ? scaledPixels(170)
                          //     : undefined
                          //   }}>
                          <>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={{color: isFocused ? 'white' : 'gray', width: userName.length > 8
                              ? scaledPixels(170)
                              : undefined,
                              fontSize:
                                userName.length > 8
                                  ? scaledPixels(20)
                                  : scaledPixels(25),
                                  alignSelf:'center',
                                  textAlign:'center'
                              }}>
                              {userName ? userName : 'Guest'}
                            </Text>
                            <Spacer direction="horizontal" gap="$2" />
                            </>
                          // </Typography>
                        )}
                      </View>
                    )}
                  </SpatialNavigationFocusableView>
                  <Spacer direction="vertical" gap={'$10'} />
                  <MenuItem
                    label={'Home'}
                    icon={'Home'}
                    isMenuOpen={isMenuOpen}
                    isActive={state.index === 0}
                    onSelect={() =>{ navigation.navigate('Home');
                    toggleMenu(false);
                    }}
                  />
                  <Spacer direction="vertical" gap={'$5'} />
                  <MenuItem
                    label={'Search'}
                    icon={'Search'}
                    isMenuOpen={isMenuOpen}
                    isActive={state.index === 1}
                    onSelect={() =>{ navigation.navigate('MovieSearch');toggleMenu(false);}}
                  />
                  <Spacer direction="vertical" gap={'$5'} />
                  {/* <MenuItem
                    label={'Log out'}
                    icon={'Grid3X3'}
                    isMenuOpen={isMenuOpen}
                    isActive={state.index === 2}
                    onSelect={() => navigation.navigate('MovieSearch')}
                  /> */}

                  {session ? (
                    <MenuItem
                      isMenuOpen={isMenuOpen}
                      onSelect={() => LogOut()}
                      label={'Log Out'}
                      icon={'LogOut'}
                      isActive={state.index === 2}
                    />
                  ) : (
                    <MenuItem
                      label={'Log In'}
                      icon={'LogIn'}
                      isMenuOpen={isMenuOpen}
                      isActive={state.index === 3}
                      onSelect={() => UserLogin()}
                    />
                  )}
                </Fragment>
                {/* );
                })}  */}
              </View>
            </DefaultFocus>
          </MenuContainer>
        </SpatialNavigationView>
      </AbsoluteMenuContainer>
    </SpatialNavigationRoot>
  );
};

const MenuContainer = styled.View<{isOpen: boolean}>(({isOpen, theme}) => ({
  position: 'absolute',
  left: 0,
  backgroundColor:'transparent',
  width: isOpen ? theme.sizes.menu.open : theme.sizes.menu.closed,
  height: windowDimensions.height,
  paddingLeft: theme.spacings.$3,
  // justifyContent: 'center',
}));

const MenuOverlay = styled(Animated.View)(({theme}) => ({
  position: 'absolute',
  left: 0,
  backgroundColor:theme.colors.background.mainHover + 99,
  height: windowDimensions.height,
}));

const ActiveIndicator = styled.View<{isActive: boolean}>(
  ({isActive, theme}) => ({
    marginRight: 4,
    width: 4,
    height: '80%',
    backgroundColor: isActive ? 'white' : 'transparent',
    borderRadius: 4,
  }),
);

const MenuSpacer = styled.View(({theme}) => ({
  width: theme.sizes.menu.closed,
}));

const AbsoluteMenuContainer = styled.View({
  position: 'absolute',
});

const ProgramImage = styled(Image)<{}>(() => ({
  height: '100%', //isFocused ? '100%':'90%',
  width: '100%',
  flex: 1,
  // borderRadius:'100%'
}));
