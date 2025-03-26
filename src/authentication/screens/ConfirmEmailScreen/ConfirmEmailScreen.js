import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView,   Platform} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
// import {useNavigation} from '@react-navigation/core';
import {useForm} from 'react-hook-form';
import {useRoute,useIsFocused,CommonActions,useNavigation} from '@react-navigation/native';
// import {Auth} from 'aws-amplify';
import {getloggedUserInfo, initialAuthUser, respondToAuthChallenge} from '../../service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sethasSession } from '../../../../redux/reducers/session';
import { useDispatch } from 'react-redux';
import { black } from '../../../helper/Color';
import { SpatialNavigationRoot } from 'react-tv-space-navigation';
import  TextInputs  from '../../../../src1/design-system/components/TextInput'  //'../../../TVComponents/design-system/components/TextInput';
import { Button } from '../../../../src1/design-system/components/Button' //'../../../TVComponents/design-system/components/registerButton';
// import Toast from 'react-native-simple-toast';
import alert from   '../../../component/Utils/alert';
import { ActivityIndicator } from 'react-native-paper';
import { Page } from '../../../../src1/components/Page';
import { Spacer } from '../../../../src1/design-system/components/Spacer';
import { theme } from '../../../../src1/design-system/theme/theme';
import { Typography } from '../../../../src1/design-system/components/Typography';
const isWider=Platform.isTV || Platform.OS==='web';
const ConfirmEmailScreen = () => {
  const route = useRoute();
  const isFocused =useIsFocused();
  const {control, handleSubmit, watch} = useForm({
    defaultValues: {email: route?.params?.initialUser?.ChallengeParameters?.email},
  });
  const [userEmail,setUserEmail]=useState(route?.params?.initialUser?.ChallengeParameters?.email) 
  const [confmCode,setconfmCode]=useState('123456') 


  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [session,setSession]=useState(route?.params?.initialUser?.Session)
  // const routes = useSelector(state => state.route.route);
  const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const username = watch('username');

  const navigation = useNavigation();


  const onConfirmPressed = async data => {

     const email= isWider?userEmail:data.email;
     const code=isWider?confmCode:data.code;

    try {
      // await Auth.confirmSignUp(data.email, data.code);
      // navigation.navigate('SignIn');
      setLoading(true)
      let AuthChallenge=await respondToAuthChallenge(email,code,session)
      console.log('response---',AuthChallenge)
      if(AuthChallenge.hasOwnProperty('Session')){
        console.log('has session AuthChallenge---',AuthChallenge)
        setSession(AuthChallenge?.Session);
        alert('Oops', 'OTP is not correct!');
        setLoading(false)

      }else if(AuthChallenge && AuthChallenge.AuthenticationResult && AuthChallenge.AuthenticationResult.AccessToken){
        
        setLoading(false)
        const userInfo = await getloggedUserInfo(email);
        console.log('userInfo---',userInfo)
        const mergedObject = userInfo?.attributes.reduce((acc, attribute) => {
          acc[attribute.name] = attribute.value;
          return acc;
        }, {});
        console.log('mergedObject---',mergedObject)
        let userData={
          'user':mergedObject,
          'AccessToken':AuthChallenge.AuthenticationResult.IdToken,
          'TokenExpireIn': new Date().getTime() + (AuthChallenge?.AuthenticationResult?.ExpiresIn * 1000 ) 
        }
        
        console.log('has AccessToken AuthChallenge---',userData)
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        dispatch(sethasSession(userData));
      // navigation.pop(); // Remove the last screen
      navigation.pop(); // Remove the second-to-last screen
      navigation.goBack(); // Return to the screen from which you came
      // Toast.showWithGravity(
      //   'User Logged in successfully !',
      //   Toast.LONG,
      //   Toast.CENTER,
      // );
      
      }
    } catch (e) {
      setLoading(false)
      alert('Oops', e.message);
    }
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  const onResendPress = async () => {
    try {
      let initialUser=await initialAuthUser(route?.params?.initialUser?.ChallengeParameters?.email);
      if(initialUser.hasOwnProperty('Session')){
        setSession(initialUser?.Session);
      }
      setconfmCode(null)
      alert('Success', 'Code was resent to your email');
    } catch (e) {
      alert('Oops', e.message);
    }
  };

  if(isWider){
    return (
        <Page>
        <View style={styles.rootTv}>
          <Text style={styles.title}>Confirm your email</Text>
  
          {/* <CustomInput
            name="email"
            control={control}
            placeholder="Email"
            rules={{
              required: 'Email is required',
              pattern: {value: EMAIL_REGEX, message: 'Email is invalid'},
            }}
          />
  
          <CustomInput
            name="code"
            control={control}
            placeholder="Enter your confirmation code"
            rules={{
              required: 'Confirmation code is required',
            }}
          /> */}


         {/* <TextInputs 
              label={'Email'}
              value={userEmail}
              onChange={(txt)=>setUserEmail(txt)}
              readOnly={true}
              edit={false}
              // error={error}
            /> */}
             <View style={{flexDirection:'column',width:'100%',marginVertical:10}}>
              {/* <Text style={{color:'gray'}}>Email</Text> */}
              <Typography>Email</Typography>
             <View style={styles.disable}>
              <Text style={{color:'gray'}}>{userEmail}</Text>
            </View>
             </View>
           

          <TextInputs 
              label={'Enter your confirmation code'}
              value={confmCode}
              readOnly={false}
              onChange={(txt)=>setconfmCode(txt)}
               keyboardType='default'
              // error={error}
            />

          <Button label={loading ? 'Loading...' : 'Confirm'} onSelect={()=>onConfirmPressed()} />
          <Spacer direction='vertical' gap={'$7'} />

          <Button label={'Resend code'} type='outLine' onSelect={onResendPress} />
          <Spacer direction='vertical' gap={'$7'} />
  
          <Button label={'Back to Sign in'} type='text' onSelect={onSignInPress} />
        </View>
        {loading && <ActivityIndicator style={styles.loader} animating={true} color={'white'} />}
        </Page>
    );
  }


  return (
    <ScrollView style={styles.conainer} keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Confirm your email</Text>

        <CustomInput
          name="email"
          control={control}
          placeholder="Email"
          rules={{
            required: 'Email is required',
            pattern: {value: EMAIL_REGEX, message: 'Email is invalid'},
          }}
        />

        <CustomInput
          name="code"
          control={control}
          placeholder="Enter your confirmation code"
          rules={{
            required: 'Confirmation code is required',
          }}
        />

        <CustomButton   text={loading ? 'Loading...' : 'Confirm'} onPress={handleSubmit(onConfirmPressed)} />

        <CustomButton
          text="Resend code"
          onPress={onResendPress}
          type="SECONDARY"
        />

        <CustomButton
          text="Back to Sign in"
          onPress={onSignInPress}
          type="TERTIARY"
        />
      </View>
      {loading && <ActivityIndicator style={styles.loader} animating={true} color={'white'} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  conainer:{
    backgroundColor:'black',
    flex:1,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fafafa',
    margin: 10,
    paddingBottom:30
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
  loader:{ position: 'absolute',
  zIndex: 999,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',},
  disable:{
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: theme.colors.background.inputBG,
    paddingHorizontal:8,
    height:55,
    width:'100%',
    justifyContent:'center',
    marginVertical:10
  }
});

export default ConfirmEmailScreen;
