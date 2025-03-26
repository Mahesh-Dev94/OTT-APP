import {Direction} from '@bam.tech/lrud';
import {
  DefaultFocus,
  SpatialNavigationNode,
  SpatialNavigationRoot,
  SpatialNavigationView,
} from 'react-tv-space-navigation';
import {useMenuContext} from './MenuContext';
import {Button} from '../../design-system/components/menuButtons';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, View, Image, Text, Platform} from 'react-native';
import styled from '@emotion/native';
import {Typography} from '../../design-system/components/Typography';
import {Spacer} from '../../design-system/components/Spacer';
import {Box} from '../../design-system/components/Box';
import {useTheme} from '@emotion/react';
import React from 'react';
import {scaledPixels} from '../../design-system/helpers/scaledPixels';
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sethasSession } from '../../../../redux/reducers/session';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
// import Images from 'component/Utils/ImageComponent';

const windowDimensions = Dimensions.get('window');

const MenuItem = ({
  shortLabel,
  label,
  isMenuOpen,
  onSelect,
}: {
  shortLabel: string;
  label: string;
  isMenuOpen: boolean;
  onSelect: () => void;
}) => {
  return (
    <Box direction="horizontal" alignItems="center">
      <Button
        label={label}
        type={'icon'}
        onSelect={onSelect}
        isMenuOpen={isMenuOpen}
      />
      {isMenuOpen && (
        <>
          <Spacer direction="horizontal" gap="$2" />
          <Typography>{shortLabel}</Typography>
        </>
      )}
    </Box>
  );
};

export const MenuList = () => {
  const {isOpen: isMenuOpen, toggleMenu} = useMenuContext();
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [userName,setUserName]=useState('');
  const route = useSelector((state:any)=> state.route.route);
  const session = useSelector((state:any) => state.hasSession.hasSession);
  const [logo, setLogo] = useState('');
  useEffect(()=>{
    if (session) {
      console.log('session---',session)
      setUserName(session.user?.name ?session.user?.name: session.user?.email);
      setLogo(session.user?.picture);
    }else{
      setUserName('');
      setLogo('');
    }
  }
  ,[dispatch,session])


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

  const resetAndNavigateToFirstScreen = () => {
    if (route === 'Home') {
      navigation.goBack();
    } else {
      navigation.goBack();
    }
  };

 const LogOut=async()=>{
    await  AsyncStorage.removeItem('user');
    Platform.OS==='web'? await signOut():null;
    dispatch(sethasSession(null));
 } 

 const UserLogin=()=>{
  navigation.navigate('SignIn' as never)
  toggleMenu(false);
 }

 const _onProfileUpdate=()=>{
  if (session) {
    navigation.navigate('UpdateProfile' as never);
    toggleMenu(false);
  }
 }

 useEffect(()=>{
  if (Platform.OS==='web') {
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
         'TokenExpireIn': payload?.exp? (payload?.exp* 1000):(new Date().getTime() + 3600000 )
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

  return (
    <SpatialNavigationRoot
      isActive={isMenuOpen}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
      <SpatialNavigationView
        direction="vertical"
        style={ {
          backgroundColor:'transparent',
        }
        }>
        <MenuSpacer />
        <MenuOverlay style={{width: animatedWidth}} />
        <MenuContainer>
          <Spacer direction="vertical" gap="$10" />
          <Spacer direction="vertical" gap="$2" />
          <SpatialNavigationNode
            onSelect={() =>_onProfileUpdate()}
            isFocusable={true}>
            {({isFocused}) => (
              <View style={{alignSelf:'flex-start',alignItems:'flex-start'}}>
                <View
                  style={{
                    height: isMenuOpen ? scaledPixels(140) : scaledPixels(70),
                    width: isMenuOpen ? scaledPixels(140) : scaledPixels(70),
                    overflow: 'hidden',
                    borderRadius: isMenuOpen
                      ? scaledPixels(140)
                      : scaledPixels(70),
                    borderColor: isMenuOpen && isFocused ? 'white' : 'gray',
                    borderWidth: 2,
                  }}>
                  <ProgramImage
                    source={logo ? { uri: logo } : require('../../modules/program/assets/rabbit5.png')} />
                </View>
                {isMenuOpen && <Spacer direction="vertical" gap="$5" />}
               {isMenuOpen && <Typography
                  style={{
                    fontSize: (userName.length > 8 )? scaledPixels(20) : scaledPixels(25),
                    alignItems:'center',
                    alignSelf:'center'
                  }}
                  
                  width={userName.length > 8 ? scaledPixels(170): undefined}
                  >
                 <Text
                    numberOfLines={1}
                    style={{color:isFocused ? 'white' : 'gray',}}>{userName?userName:'Guest'}</Text>
                  <Spacer direction="horizontal" gap="$2" />
               
                </Typography>}
              </View>
            )}
          </SpatialNavigationNode>

          <Spacer direction="vertical" gap="$10" />
          <Spacer direction="vertical" gap="$10" />
          <DefaultFocus>
            <MenuItem
              shortLabel="Home"
              label="home"
              isMenuOpen={isMenuOpen}
              onSelect={() => resetAndNavigateToFirstScreen()}
            />
          </DefaultFocus>
          <Spacer direction="vertical" gap="$7" />
          <MenuItem
            shortLabel="Search"
            label="search"
            isMenuOpen={isMenuOpen}
            onSelect={() => {navigation.navigate('MovieSearch' as never);toggleMenu(false);}}
          />
          <Spacer direction="vertical" gap="$7" />
          {session ? (
            <MenuItem
              shortLabel="Log Out"
              label="sign-out-alt"
              isMenuOpen={isMenuOpen}
              onSelect={() => LogOut()}
            />
          ) : (
            <MenuItem
              shortLabel="Log In"
              label="sign-in-alt"
              isMenuOpen={isMenuOpen}
              onSelect={() => UserLogin()}
            />
          )}
        </MenuContainer>
      </SpatialNavigationView>
    </SpatialNavigationRoot>
  );
};

export const Menu = () => {
  const navigation = useNavigation();
  const route = useSelector((state:any) => state.route.route);
  // const route=navigation.getCurrentRoute()
  console.log('###route---***',route)
  if( route==='Home'|| route==='details' || route==='UpdateProfile' ||  route==='Search'){
  return (
    <MenuList/>
  )}else {
    return null
  }

  
}

const MenuContainer = styled.View(({theme}) => ({
  position: 'absolute',
  left: 0,
  top: 40,
  backgroundColor:'transparent',
  width: theme.sizes.menu.open,
  height: windowDimensions.height,
  paddingLeft: theme.spacings.$3,
  // justifyContent: 'center',
  paddingTop: theme.spacings.$10,
}));

const MenuOverlay = styled(Animated.View)(({theme}) => ({
  position: 'absolute',
  left: 0,
  backgroundColor: theme.colors.background.mainHover,
  height: windowDimensions.height,
}));

const MenuSpacer = styled.View(({theme}) => ({
  width: theme.sizes.menu.closed,
}));

const ProgramImage = styled(Image)<{}>(() => ({
  height: '100%', //isFocused ? '100%':'90%',
  width: '100%',
  flex:1
  // borderRadius:'100%'
}));
