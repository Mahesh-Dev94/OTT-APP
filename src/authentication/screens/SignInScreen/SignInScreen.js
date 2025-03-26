import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Platform,
  Text,
  Linking,
} from 'react-native';
import Logo from '../../../assets/images/RSystems.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useForm} from 'react-hook-form';
import {registerUser, initialAuthUser} from '../../service';
import {signInWithRedirect, signOut,fetchAuthSession,} from 'aws-amplify/auth';
// import {Hub} from '@aws-amplify/core';
import { Hub } from 'aws-amplify/utils';
import {useDispatch} from 'react-redux';
import {setroute} from '../../../../redux/reducers/routeName';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {SpatialNavigationRoot} from 'react-tv-space-navigation';
import TextInput from '../../../../src1/design-system/components/TextInput';    //'../../../TVComponents/design-system/components/TextInput';
import {Button} from '../../../../src1/design-system/components/Button';   //'../../../TVComponents/design-system/components/registerButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sethasSession } from '../../../../redux/reducers/session';
// import Toast from 'react-native-simple-toast';
import { white } from '../../../helper/Color';
import { ActivityIndicator } from 'react-native-paper';
import alert from  '../../../component/Utils/alert'; 
import { Page } from '../../../../src1/components/Page';
import { Spacer } from '../../../../src1/design-system/components/Spacer';
const isWider = Platform.isTV || Platform.OS === 'web';
const SignInScreen = () => {
  const {height} = useWindowDimensions();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [customState, setCustomState] = useState(null);
  const [userEmail, setUserEmail] = useState('autotest@gmail.com');
  

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      dispatch(setroute('login'));
    }
  }, [isFocused]);

  const _register = async userEmail => {
    setLoading(true);
    let register = await registerUser(userEmail);
    if (register === 'Success') {
      let initialUser = await initialAuthUser(userEmail);
      if (initialUser.Session != '') {
        setLoading(false);
        navigation.navigate('ConfirmEmail', {initialUser: initialUser});
      }
    }else{
      setLoading(false);
    }
  };

  const onSignInPressed = data => {
    if (isWider) {
      if (userEmail === '') {
        alert('Please enter email address!');
      } else if (error) {
        alert('Please enter valid email address!');
      } else {
        _register(userEmail);
      }
    } else {
      _register(data.email);
    }
  };

  const onSignInAmazon = async () => {
    await signOut();
    if (Platform.isTV) {
      navigation.navigate('SignInQrFacebookScreen');
    } else {
      console.warn('onSignInAmazon @');
      signInWithRedirect({provider: 'Amazon'});
    }
  };

  const onSignInGoogle = async () => {
    await signOut();
    if (Platform.isTV) {
      navigation.navigate('SignInQrGoogleScreen');
    } else {
      console.log('Google')
      signInWithRedirect({provider: 'Google'});
    }
  };

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      console.log('event payload:---',payload)
      switch (payload.event) {
        case "signInWithRedirect":
          console.log( "signInWithRedirect")
          getUserInfo();
          break;
        case "signInWithRedirect_failure":
          alert("signInWithRedirect_failure,An error has ocurred during the OAuth flow.");
          break;
        case "customOAuthState":
          setCustomState(payload.data);
          // alert("customOAuthState-",payload.data);
          break;
      }
    });
    return unsubscribe;
  }, []);

 

  const getUserInfo = async () => {
    try {
      setLoading(true);
      var cognitoTokens = (await fetchAuthSession()).tokens;
      
     let rawToken = cognitoTokens?.idToken?.toString();
     let payload = cognitoTokens?.idToken?.payload;
     console.log('cognitoTokens payload--',payload)
      let userData={
        'user':payload,
        'AccessToken':rawToken,
        'TokenExpireIn': payload.exp * 1000
      }
      
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      dispatch(sethasSession(userData));
      setTimeout(() => {
        navigation.goBack(); // Return to the screen from which you came
      //  Toast.showWithGravity(
      //    'User Logged in successfully !',
      //    Toast.LONG,
      //    Toast.CENTER,
      //  );
       setLoading(false);
      }, 500);
   
    } catch (error) {
      alert('error---',error)
      console.error(error);
      console.log('Not signed in');
    }
  };

  const handleInputChange = text => {
    // console.log('text---', text);
    setUserEmail(text);
    // Custom email validation using a regular expression
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValid = emailPattern.test(text);
    // console.log('isValid---', isValid);
    setError(!isValid);
  };

  if (isWider) {
    return (
      // <SpatialNavigationRoot isActive={isFocused}>
      <Page>
        <View style={styles.rootTv}>
          <Image
            source={Logo}
            style={[styles.logo]}
            resizeMode="contain"
          />

          <TextInput
            label={'Email'}
            value={userEmail}
            onChange={handleInputChange}
            keyboardType={'email-address'}
            error={error}
          />

          {error && <Text style={{color: 'red',paddingBottom:10}}>Invalid email address!</Text>}

          <Button
            label={loading ? 'Loading...' : 'Sign In'}
            onSelect={() => onSignInPressed()}
          />
          <Spacer direction='vertical' gap={'$7'} />

   { Platform.OS==='web' && 
   <>
    <Button
            label={'Sign In with Google'}
            onSelect={onSignInGoogle}
          />
    <Spacer direction='vertical' gap={'$7'} />
    <Button
            label={'Sign In with Amazon'}
            onSelect={onSignInAmazon}
          />
            <Spacer direction='vertical' gap={'$7'} />
   </>
    }



       <Button
            label={'Cancel'}
            onSelect={() => navigation.goBack()}
          />


        </View>
        {loading && <ActivityIndicator style={styles.loader} animating={true} color={'white'} />}
      {/* </SpatialNavigationRoot> */}
      </Page>
    );
  }

  return (
    <ScrollView style={styles.conainer} keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Image
          source={Logo}
          style={[styles.logo]}
          resizeMode="contain"
        />

        <CustomInput
          name="email"
          placeholder="Email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {value: /^\S+@\S+$/i, message: 'Invalid email'},
          }}
        />

        <CustomButton
          text={loading ? 'Loading...' : 'Sign In'}
          onPress={handleSubmit(onSignInPressed)}
        />

        <SocialSignInButtons
          onSignInFacebook={onSignInAmazon}
          onSignInGoogle={onSignInGoogle}
        />
         <CustomButton
          text="Cancel"
          onPress={()=>navigation.goBack()}
          type="TERTIARY"
        />
      </View>
     
  {loading && <ActivityIndicator style={styles.loader} animating={true} color={'white'} />}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  conainer: {
    backgroundColor: 'black',
    flex: 1,
  },
  root: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
    flex: 1,
    marginTop: 30,
  },
  rootTv:{
    alignItems: 'center',
        paddingHorizontal: '25%',
        paddingVertical:'5%',
        backgroundColor:'black',
        flex:1
  },
  logo: {
    width: 150, // Adjust the width and height as needed
    height: 150,
    borderRadius: 100, // Half of the width or height to make it a circle
    marginBottom:20,
    borderColor:white,
    borderWidth:5
  },
  loader:{ position: 'absolute',
  zIndex: 999,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',}
});

export default SignInScreen;
