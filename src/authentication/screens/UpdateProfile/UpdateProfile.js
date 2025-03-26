import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView,   Platform, Image,TouchableHighlight } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useForm } from 'react-hook-form';
import { useIsFocused,useNavigation } from '@react-navigation/native';
// import {Auth} from 'aws-amplify';
import { updateUserProfile } from '../../service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateSession } from '../../../../redux/reducers/session';
import { SpatialNavigationNode, SpatialNavigationView } from 'react-tv-space-navigation';
import TextInput from '../../../../src1/design-system/components/TextInput';    //'../../../TVComponents/design-system/components/TextInput';
import { Button } from  '../../../../src1/design-system/components/Button';    //'../../../TVComponents/design-system/components/registerButton';
import { Page } from  '../../../../src1/components/Page'  //'../../../TVComponents/components/Page';
import { setroute } from '../../../../redux/reducers/routeName';
import { RadioButton } from 'react-native-paper';
import DatePicker from 'react-native-date-picker'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CustomActionSheet from '../../../component/customActionSheet';
import * as Progress from 'react-native-progress';
import { uploadData, getUrl } from 'aws-amplify/storage';
// import { Spacer } from '../../../TVComponents/design-system/components/Spacer';
// import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import BackIcon from '../../../component/Utils/BackIcon';
import alert from '../../../component/Utils/alert';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Spacer } from '../../../../src1/design-system/components/Spacer';

const isWider = Platform.isTV || Platform.OS === 'web';
const UpdateProfile = () => {
  const isFocused = useIsFocused();
  const session =useSelector(state => state.hasSession.hasSession);
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {name:session? session?.user.name:null || '',
      dob:session?session?.user.birthdate : null,
      phone:session?session?.user.phone_number ?session?.user.phone_number.slice(-10):null: null},
  });
  const [Name, setName] = useState(session?.user.name);
  const [userProfileData, setUserProfileData] = useState(session);

  const [gender, setGender] = useState(session?.user.gender || '')
  const [date, setDate] = useState(new Date())
  const [openCalender, setOpenCalender] = useState(false)
  const [logo, setLogo] = useState(session?.user.picture || '');
  const [s3logo, setS3Logo] = useState(session?.user.picture || '');

  const [_openActionsheet, setOpenActionSheet] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
 
  const navigation = useNavigation();
  useEffect(() => {
    dispatch(setroute('UpdateProfile'))
    // getUserDetails();
  }, [isFocused, navigation])


  // custome validation for mobile number
  const validatePhone = value => {
    const isValidIndianPhoneNumber = /^\d{10}$/;
    return isValidIndianPhoneNumber.test(value) || 'Invalid Indian phone number';
  };

  // Custom validation function for date
  const validateDate = value => {
    return value ? undefined : 'Date of birth is required';
  };

  const onDateSelect = (selectedDate) => {
    setValue('dob', selectedDate.toISOString().split('T')[0]); // Set the selected date to the 'dob' field
    setDate(selectedDate); // Update the 'date' state with the selected date
    setOpenCalender(false); // Close the DatePicker modal
  };

  const _onlaunchCamera = () => {
    launchCamera({ mediaType: 'photo', quality: .6, maxWidth: 200, maxHeight: 200, }, (response) => {
      if (!response.didCancel && !response.error) {
        console.log('response---',response)
        setLogo(response.assets[0].uri);
        setOpenActionSheet(false);
        _onUploadFile(response.assets[0]);

      }
    });
  };

  const _onlaunchImageLibrary = () => {
    launchImageLibrary({ mediaType: 'photo', quality: .6, maxWidth: 200, maxHeight: 200, }, (response) => {
      if (!response.didCancel && !response.error) {
        setLogo(response.assets[0].uri);
        setOpenActionSheet(false);
        _onUploadFile(response.assets[0]);
      }
    });
  };

  // const _onSelectPhoto = (option) => {
  //   if (option === 1) {
  //     _onlaunchCamera(); // Handle camera capture
  //   } else if (option === 2) {
  //     _onlaunchImageLibrary(); // Handle image selection from library
  //   }
  // };

  const _onSelectPhoto = async (option) => {
    try {
      if (option === 1) {
      // Check camera permissions
      const cameraPermission = await checkCameraPermission();
  
      // Handle camera permissions
      if (cameraPermission === RESULTS.GRANTED) {
        // Camera permission granted, launch camera
        _onlaunchCamera(option);
      } else {
        // Camera permission not granted, request permission
        const result = await requestCameraPermission();
        if (result === RESULTS.GRANTED) {
          // Camera permission granted, launch camera
          _onlaunchCamera(option);
        } else {
          // Camera permission denied, handle accordingly
          console.warn('Camera permission denied');
        }
      }
    } else if (option === 2) {
  
      // Check photo library permissions
      const photoLibraryPermission = await checkPhotoLibraryPermission();
  
      // Handle photo library permissions
      if (photoLibraryPermission === RESULTS.GRANTED) {
        // Photo library permission granted, launch image library
        _onlaunchImageLibrary(option);
      } else {
        // Photo library permission not granted, request permission
        const result = await requestPhotoLibraryPermission();
        if (result === RESULTS.GRANTED) {
          // Photo library permission granted, launch image library
          _onlaunchImageLibrary(option);
        } else {
          // Photo library permission denied, handle accordingly
          console.warn('Photo library permission denied');
        }
      }
    }} catch (error) {
      console.error('Error checking permissions:', error);
    }
  };
  
  const checkCameraPermission = async () => {
    return Platform.select({
      ios: check(PERMISSIONS.IOS.CAMERA),
      android: check(PERMISSIONS.ANDROID.CAMERA),
    });
  };
  
  const requestCameraPermission = async () => {
    return Platform.select({
      ios: request(PERMISSIONS.IOS.CAMERA),
      android: request(PERMISSIONS.ANDROID.CAMERA),
    });
  };
  
  const checkPhotoLibraryPermission = async () => {
    return Platform.select({
      ios: check(PERMISSIONS.IOS.PHOTO_LIBRARY),
      android: check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE),
    });
  };
  
  const requestPhotoLibraryPermission = async () => {
    return Platform.select({
      ios: request(PERMISSIONS.IOS.PHOTO_LIBRARY),
      android: request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE),
    });
  };

  const fetchResourceFromURI = async uri => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const _onUploadFile = async (response) => {
    setUploading(true);
    const uri = response.uri;
    const fileName = response.fileName;
    const fileType = response.type;

    console.log(uri, fileName, fileType)

    try {
      const img = await fetchResourceFromURI(uri);
      const result = await uploadData({
        key: fileName,
        data: img,
        options: {
          contentType: fileType,
          accessLevel: 'guest', // defaults to `guest` but can be 'private' | 'protected' | 'guest'
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              const uploadProgress = (transferredBytes / totalBytes) * 100;
              setProgress(uploadProgress);
              console.log('Upload progress', totalBytes, transferredBytes)
            }
          }
        }
      }).result;
      console.log('File uploaded successfully:', result);
      // get url of uploaded file in s3 bucket
      let getUrlResult = await getUrl({
        key: result.key,
        contentType: fileType,
      });
      
      setUploading(false);
      // convert it obj to string and extract valid url from s3 long url
      let s3Url = JSON.stringify(getUrlResult.url);
      const imageUrlTillJpg = s3Url.substring(0, s3Url.indexOf('.jpg') + 4);
      console.log('imageUrlTillJpg---:',imageUrlTillJpg.slice(1))
        setS3Logo(imageUrlTillJpg.slice(1));
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  const onUpdateProfile = async (data) => {
    if (gender === '') {
      alert('Please select gender!');
      return;
    }
    var Postdata;
    // var userProfileData=session;
    if(isWider){
      if (Name === '') {
        alert('Please enter name!');
        return;
      }
    const userAttributes= [
        {
          name: 'gender',
  
          value:gender,
        },
        {
          name: 'name',
  
          value: Name,
        }
      ];
       Postdata = {
        userAttributes:userAttributes,
        username: session?.user.email 
      }

    }else{
    
      const userAttributesMob= [
        {
          name: 'gender',
  
          value:gender,
        },
        {
          name: 'name',
  
          value: data.name,
        }
        ,
        {
          name: 'birthdate',
  
          value: data.dob,
        },
        {
          name: 'picture',
  
          value: s3logo,
        },
        {
          name: 'phone_number',
  
          value:data.phone ? '+91'+ data.phone:null,
        }
      ];
      userProfileData.user.name=data.name;
      userProfileData.user.picture=s3logo;
      Postdata = {
        userAttributes:userAttributesMob,
        username: session?.user.email
      }
    }
   
    setLoading(true);
    const update_profile = await updateUserProfile(Postdata)
    console.log(userProfileData,'------Postdata---',update_profile)
    setLoading(false);
    if(update_profile==='Success'){
      setTimeout(async() => {
        await AsyncStorage.setItem('user', JSON.stringify(userProfileData));
        navigation.goBack();
        dispatch(updateSession(userProfileData));
        // Return to the screen from which you came
      }, 500);
    }else{
      alert('update profile status: ',update_profile)
    }
  

    //  Toast.showWithGravity(
    //   'User profile updated successfully !',
    //   Toast.LONG,
    //   Toast.CENTER,
    // );
  }

  if (isWider) {
    return (
      <Page>
        <View style={styles.rootTv}>
          <Text style={styles.title}>Update Profile</Text>
          <TextInput
            label={'User Name'}
            value={Name}
            onChange={txt =>{ 
              setName(txt);
              setUserProfileData(prevData => ({
                ...prevData,
                user: {
                  ...prevData.user,
                  name: txt,
                },
              }));
            }}
          />
          <SpatialNavigationView
            direction="horizontal"
            style={styles.container}>
            <SpatialNavigationNode
              isFocusable
              onSelect={() => setGender('male')}>
              {({ isFocused }) => (
                <View
                  style={[
                    styles.radioButton,
                    isFocused && styles.selected,
                  ]}>
                  {/* <Icon
                    name={'male'}
                    size={scaledPixels(25)}
                    color={isFocused ? 'white' :gender === 'male'?'white':'gray'}
                  /> */}
                  <RadioButton
                    value="male"
                    status={gender === 'male' ? 'checked' : 'unchecked'}
                    uncheckedColor={'gray'}
                    onPress={() => {
                      setGender('male');
                      setUserProfileData(prevData => ({
                        ...prevData,
                        user: {
                          ...prevData.user,
                          gender: 'male',
                        },
                      }));
                  }}
                  />
                  <Text
                    style={[
                      styles.radioLabel,
                      { color: isFocused ? 'white' : gender === 'male' ? 'white' : 'gray' },
                    ]}>
                    Male
                  </Text>
                </View>
              )}
            </SpatialNavigationNode>
            <SpatialNavigationNode
              isFocusable
              onSelect={() =>{ 
                setGender('female');
                setUserProfileData(prevData => ({
                  ...prevData,
                  user: {
                    ...prevData.user,
                    gender: 'female',
                  },
                }));
                }}>
              {({ isFocused }) => (
                <View
                  style={[
                    styles.radioButton,
                    isFocused && styles.selected,
                  ]}>
                  {/* <Icon
                    name={'female'}
                    size={scaledPixels(25)}
                    color={isFocused ? 'white' : isFocused ? 'white' :gender === 'female'?'white':'gray'}
                  /> */}
                  <RadioButton
                    value="female"
                    status={gender === 'female' ? 'checked' : 'unchecked'}
                    uncheckedColor={'gray'}
                    onPress={() => setGender('female')}
                  />
                  <Text
                    style={[
                      styles.radioLabel,
                      { color: isFocused ? 'white' : isFocused ? 'white' : gender === 'female' ? 'white' : 'gray' },
                    ]}>
                    Female
                  </Text>
                </View>
              )}
            </SpatialNavigationNode>
          </SpatialNavigationView>
          <Spacer direction="vertical" gap="$10" />
          <Button
            label={loading ? 'Loading...' : 'Confirm'}
            onSelect={() => onUpdateProfile()}
          />
        </View>
        {loading && <ActivityIndicator style={styles.loader} animating={true} color={'white'} />}
      </Page>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'black' }} keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={true}>
      <View style={styles.root}>
        <Text style={styles.title}>Update Profile</Text>
        <TouchableHighlight style={{ paddingBottom: 50 }} onPress={() => setOpenActionSheet(true)}>
          <View style={styles.logoContainer}>
            {logo ? <Image source={{ uri: logo }} style={styles.logo} /> : <View style={styles.cameraIcon}>
              <Icon name="camera" size={45} color="white" />
            </View>}
            {uploading && <Progress.Circle
              size={130}
              indeterminate={!uploading}
              borderWidth={0}
              color="#50C878"
              progress={progress / 100}
              showsText
              textStyle={{ fontSize: 20 }}
              formatText={() => `${progress.toFixed(2)}%`}
              style={styles.progressBar}
            />}
          </View>
        </TouchableHighlight>
        <CustomInput
          name="name"
          control={control}
          placeholder="Name"
          rules={{
            required: 'Name is required'
          }}
        />

        <CustomInput
          name="phone"
          control={control}
          placeholder="Phone number"
          rules={{
            required: 'Phone number is required', validate: validatePhone
          }}
        />
        <TouchableHighlight style={{ width: '100%' }} onPress={() => setOpenCalender(true)}>
          <CustomInput
            name="dob"
            control={control}
            placeholder="Date of birth"
            rules={{
              validate: validateDate
            }}
          />
        </TouchableHighlight>

        <View style={styles.radioButtonConatiner}>
          <View style={styles.buttonContainer}>
            <Text style={styles.radiolabel}>
              Male
            </Text>
            <RadioButton
              value="male"
              status={gender === 'male' ? 'checked' : 'unchecked'}
              uncheckedColor={'gray'}
              onPress={() => setGender('male')}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Text style={styles.radiolabel}>
              Female
            </Text>
            <RadioButton
              value="female"
              status={gender === 'female' ? 'checked' : 'unchecked'}
              uncheckedColor={'gray'}
              onPress={() => setGender('female')}
            />
          </View>
        </View>
        <CustomButton text={loading ? 'Loading...' : 'Update'} onPress={handleSubmit(onUpdateProfile)} />

      </View>
      <DatePicker
        modal
        mode='date'
        open={openCalender}
        date={date}
        onConfirm={onDateSelect}
        onCancel={() => {
          setOpenCalender(false)
        }}
      />
      <CustomActionSheet visible={_openActionsheet} onSelect={(opt) => _onSelectPhoto(opt)} onClose={(param) => setOpenActionSheet(false)} />
      {loading && <ActivityIndicator style={styles.loader} animating={true} color={'white'} />}

   { !isWider && <BackIcon
            navigation={navigation}
            style={styles.backContainer}
            touchStyle={styles.touchStyle}
            color={'white'}
          />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
    flex: 1,
    backgroundColor: 'black',
  },
  rootTv:{
    alignItems: 'center',
        paddingHorizontal: '25%',
        paddingVertical:'5%',
        backgroundColor:'black',
        flex:1
  },
  logoContainer: {
    backgroundColor: 'gray',
    position: 'relative',
    width: 130,
    height: 130,
    borderRadius: 130,
    overflow: 'hidden', // Ensure the progress bar stays within the rounded border
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cameraIcon: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    // bottom:0,
    // height:50,
    transform: [{ translateX: -15 }, { translateY: -15 }], // Adjust position to center the icon
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fafafa',
    margin: 10,
  },
  radioButtonConatiner: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 20
  },
  radiolabel: {
    color: '#fafafa',
    fontSize: 18
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 5,
    marginHorizontal: 10,
    height:50,
    width:100,
    borderWidth: 1, // Added to ensure consistent border width
    borderColor: 'transparent',
  },
  selected: {
    borderColor:'#fff',
    borderWidth:1,
    color: '#fff',
    borderRadius:5
  },
  radioLabel: {
    marginHorizontal: 5,
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
  backContainer: {
    height: 45,
    width: 45,
    borderRadius: 45,
    position: 'absolute',
    top: 35,
    left: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff66',
  },
  touchStyle: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UpdateProfile;
