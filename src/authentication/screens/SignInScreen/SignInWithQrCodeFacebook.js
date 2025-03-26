import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import axios from 'axios';
// import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { normalize } from '../../../helper/FontSize';
import { black, blue } from '../../../helper/Color';
import CountdownTimer from './countDown';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
// import { FACEBOOK_APP_ID, FACEBOOK_CLIENT_TOKEN } from '../../../api/config';

const SignInQrFacebookScreen = () => {
  const [facebookInfo, setFacebookInfo] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [accessTokenInterval, setAccessTokenInterval] = useState(null); // Store the interval ID
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = 'https://graph.facebook.com/v2.6/device/login';
      const data = {
        // access_token: `${FACEBOOK_APP_ID}|${FACEBOOK_CLIENT_TOKEN}`,
        scope: 'email,public_profile',
      };

      const response = await axios.post(url, data);
      setFacebookInfo(response.data);
      setLoading(false);

      if (accessTokenInterval) {
        clearInterval(accessTokenInterval);
      }

      const intervalId = setInterval(() => {
        fetchAccessToken(response.data);
      }, 5000);
      setAccessTokenInterval(intervalId);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAccessToken = async (info) => {
    // console.log('fetch token api called', info.code);
    if (!info || !info?.code) {
      return;
    }

    const postData = {
      // access_token: `${FACEBOOK_APP_ID}|${FACEBOOK_CLIENT_TOKEN}`,
      code: info?.code,
    };

    try {
      const response = await axios.post(
        'https://graph.facebook.com/v2.6/device/login_status',
        postData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        if (response.data?.access_token) {
          clearInterval(accessTokenInterval);
        } else {
          const subcode = response.data?.error?.error_subcode;
          console.log('subcode---', response.data?.error?.message);
          handleSubcode(subcode);
        }
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  const handleSubcode = (subcode) => {
    if (subcode === 1349174) {
      console.log('Error: User has not yet authorized your application. Continue polling.');
      // Continue polling as needed
    } else if (subcode === 1349172) {
      console.log('Error: Your device is polling too frequently. Slow down the polling.');
      // Slow down polling as needed
    } else if (subcode === 1349152) {
      console.log('Error: The code you entered has expired. Please go back for a new code.');
      // Handle the expired code scenario, e.g., navigate the user back to the initial screen
    } else {
      console.log('Unknown error subcode:', subcode);
    }
  };

  const renderIsSignedIn = useMemo(() => {
    return (
      <View style={{ paddingBottom: 20, height: 280 }}>
        {facebookInfo ? (
          <View>
            {/* <QRCode value={facebookInfo?.verification_uri} size={260} /> */}
            <View style={{ paddingTop: 5, alignItems: 'center' }}>
              <CountdownTimer initialTime={facebookInfo.expires_in} />
            </View>
          </View>
        ) : loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        ) : null}
      </View>
    );
  }, [facebookInfo, loading]);

  const onSignInRemote = () => {
    clearInterval(accessTokenInterval);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.contentContainer}>
          <View style={styles.stepsContainer}>
            <Text style={styles.headerTitle}>Follow these steps on your computer or mobile device</Text>
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}> STEP 1</Text>
              <View style={{ width: '80%' }}>
                <Text style={styles.stepTxt}>Scan the symbol with your phone's camera or go to:</Text>
                <Text style={styles.stepTxtImp}>{facebookInfo ? facebookInfo.verification_uri : null}</Text>
              </View>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>STEP 2</Text>
              <View style={{ width: '80%' }}>
                <Text style={styles.stepTxt}>Enter sign-in code:</Text>
                <Text style={styles.stepTxtImp}>{facebookInfo ? facebookInfo.user_code : null}</Text>
              </View>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>STEP 3</Text>
              <Text style={styles.stepTxt}>Sign in to Facebook. Your TV will be ready to watch!</Text>
            </View>
          </View>
          <View style={styles.qrCodeContainer}>{renderIsSignedIn}</View>
        </View>
        {/* need to put in last of the screen */}
        <View style={styles.footerContainer}>
          <View style={styles.separator} />
          <Text style={styles.footerText}>Or enter your email and password with your remote.</Text>
          <View style={{ width: 280 }}>
            <CustomButton text="Sign In with Remote" onPress={onSignInRemote} bgColor="#e3e3e3" fgColor="#363636" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: normalize(2),
  },
  stepsContainer: {
    width: Dimensions.get('window').width > 600 ? '60%' : '100%',
    padding: normalize(4),
  },
  qrCodeContainer: {
    width: Dimensions.get('window').width > 600 ? '40%' : '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: normalize(4),
  },
  footerContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: normalize(2),
  },
  separator: {
    borderBottomColor: blue,
    borderBottomWidth: 2,
    marginBottom: normalize(1),
    width: Dimensions.get('window').width - 100,
  },
  headerTitle: {
    fontSize: normalize(2),
    color: black,
    fontFamily: 'Montserrat-Bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    paddingTop: normalize(2),
  },
  stepTitle: {
    width: '15%',
    fontSize: normalize(1.3),
    color: black,
    fontFamily: 'Montserrat-Bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTxt: {
    fontSize: normalize(1.3),
    color: black,
    fontFamily: 'Montserrat-Medium',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTxtImp: {
    fontSize: normalize(2),
    color: black,
    fontFamily: 'Montserrat-Bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: normalize(1.2),
    color: black,
    paddingBottom: 10,
  },
});

export default SignInQrFacebookScreen;
