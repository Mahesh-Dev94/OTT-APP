import React, {useState, useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {white, orange} from '../helper/Color';
import MovieScreen from '../screen/MovieScreen';
import MovieDetailScreen from '../screen/MovieDetailScreen';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {sethasSession} from '../../redux/reducers/session';

const Drawer = createDrawerNavigator();

const HomeDrawerNavigator = () => {
  const navigation = useNavigation();

  return (
    <Drawer.Navigator
      initialRouteName="Movies"
      drawerType={'slide'}
      screenOptions={{
        activeBackgroundColor: 'transparent',
        activeTintColor: orange,
        inactiveTintColor: white,
        drawerPosition: 'left',
        headerShown: false,
        drawerStyle: {
          backgroundColor: 'transparent',
          width: 230,
        },
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Movies"
        component={MovieScreen}
        options={{
          drawerLabel: () => null,
          title: null,
          drawerIcon: () => null,
        }}
      />
      <Drawer.Screen
        name="MovieDetail"
        component={MovieDetailScreen}
        options={{
          drawerLabel: () => null,
          title: null,
          drawerIcon: () => null,
        }}
      />
    </Drawer.Navigator>
  );
};

const CustomDrawerContent = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const route = useSelector(state => state.route.route);
  const session = useSelector(state => state.hasSession.hasSession);
  const [logo, setLogo] = useState('');

  useEffect(() => {
    if (session) {
      // console.log("user session", session)
      setUserName(
        session.user?.name ? session.user?.name : session.user?.email,
      );
      setLogo(session.user.picture);
    }else{
      setUserName('');
      setLogo('');
      console.log('session useeffect', session)
    }
    
  }, [session]);

  const resetAndNavigateToFirstScreen = routeName => {
    // if (route === 'Home') {
    // } else {
    //   navigation.goBack();
    // }
    navigation.dispatch(DrawerActions.closeDrawer());
    navigation.popToTop();
  };

  const LogOut = async () => {
    await AsyncStorage.removeItem('user');
    dispatch(sethasSession(''));
  };

  const UserLogin = () => {
    console.log('login pressed:');
    navigation.navigate('SignIn');
  };

  const _onProfileUpdate = () => {
    if (session) {
      navigation.navigate('UpdateProfile');
    }
  };

  const menuIcons = name => <Icon name={name} size={25} color={white} />;

  const MenuItem = ({icon, text, onPress}) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemContainer}>
        {icon}
        <Text style={styles.menuItemText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.drawerContent}>
      <TouchableOpacity onPress={_onProfileUpdate} style={styles.userContainer}>
        <Image
          source={logo ? {uri: logo} : require('../assets/images/user.png')}
          style={styles.profileImage}
        />
        <Text
          style={[styles.userName, {fontSize: userName.length > 12 ? 14 : 18}]}>
          {userName ? userName : 'Guest'}
        </Text>
      </TouchableOpacity>

      <MenuItem
        icon={menuIcons('home')}
        text="Home"
        onPress={() => resetAndNavigateToFirstScreen('Home')}
      />
      <MenuItem
        icon={menuIcons('search')}
        text="Search"
        onPress={() => navigation.navigate('MovieSearch')}
      />
      {session ? (
        <MenuItem
          icon={menuIcons('sign-out-alt')}
          text="Logout"
          onPress={LogOut}
        />
      ) : (
        <MenuItem
          icon={menuIcons('sign-in-alt')}
          text="Login"
          onPress={UserLogin}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#222',
    paddingTop: Platform.isTV ? 0 : 20,
    paddingLeft: 10,
  },
  userContainer: {
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
  userName: {
    fontSize: 18,
    color: white,
    marginBottom: 10,
  },
  menuItem: {
    width: '80%',
    marginVertical: 5,
    paddingVertical: 10,
  },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: white,
    marginLeft: 10,
    fontSize: 18,
  },
});

export default HomeDrawerNavigator;
