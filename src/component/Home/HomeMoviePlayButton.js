import React, { useState } from 'react';
import {View, Text, Dimensions,  Platform} from 'react-native';
import {white} from '../../helper/Color';
import {ImageIcon} from '../Icon/icon';
import {normalize} from '../../helper/FontSize';
import {FocusButton} from 'react-native-tv-selected-focus';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setDetailReducer} from '../../../redux/reducers/details';
import CreateResponsiveStyle from '../../helper/responsiveStyle';
import { Button } from  '../../../src1/design-system/components/Button'  //'../../TVComponents/design-system/components/Button';
import alert from  '../Utils/alert'; 

const {width} = Dimensions;
const isWider =Platform.isTV || Platform.OS==='web';
function MoviePlayButton({
  hideView = false,
  isCarousel = false,
  carouselData = undefined,
  onPress
}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const session =useSelector(state => state.hasSession.hasSession);
 
  const selectedMovieDetailHome = useSelector(
    state => state.swimlane.selectedMovieDetailHome,
  );
  const movieData = carouselData ? carouselData : selectedMovieDetailHome || {};


  const ShowAlert=async()=>{
    console.log('Alert method called')
    Platform.OS==='web' ? onPress():
    alert(
      'Alert',
      'This action requires you to log in first. Would you like to log in now?', // <- this part is optional, you can pass an empty string
      [
        {text: 'cancel', onPress: () => console.log('cancel Pressed#####')},
        {text: 'ok', onPress: () => {console.log('OKKK Pressed#####');navigation.navigate('SignIn')}},
      ],
      // {cancelable: false},
    );
  }

  const toggleModal = async() => {
    console.log('session--',session)
    if(session){
  if (isCarousel) {
      const movieDataCarosel = {movieData: carouselData};
      dispatch(setDetailReducer(movieDataCarosel));
    }
    navigation.navigate('Player', {
      mediaUuid: movieData.mediaUuid,
      liveUrl: movieData.mediaUuid ? '' : movieData.mediaUrl,
      id: movieData.id,
    });
    }else{
      ShowAlert()
    }
  
  };

  if (hideView) return null;

  return (
    <View style={Styles.container}>
      
      {isWider ? <Button label="Watch Now" onSelect={() => toggleModal()} type={'label'} />:
      <FocusButton
        activeOpacity={1}
        hasTVPreferredFocus={false}
        focusValue={1.05}
        tvParallaxProperties={{
          enabled: true,
          magnification: 1.05,
        }}
        isTVSelectable={true}
        style={ Styles.focusButton}
        underlayColor={'transparent'}
        onPress={toggleModal}
        onFocus={() => {
        }}>
        <View style={[Styles.wrapper]}>
          <ImageIcon
            name={'play'}
            size={normalize(1.5)}
            color={white}
            style={Styles.icon}
          />
          <Text style={Styles.text}>Watch Now</Text>
        </View>
      </FocusButton>}

     
    </View>
  ); 
}

export default React.memo(MoviePlayButton);

const Styles = CreateResponsiveStyle(
  //web
  {
    container: {
      marginLeft: '2%',
      paddingBottom:10
    },
    focusButton: {
      width: width,
      alignSelf:'flex-ceter',
      marginLeft:15
    },
    wrapper: {
      borderRadius: 5,
      backgroundColor: '#0066ff',
      justifyContent: 'center',
      flexDirection: 'row',
      paddingHorizontal: 10,
      height: normalize(4),
      width:  200,
    },
    text: {
      color: white,
      justifyContent: 'center',
      alignSelf: 'center',
      fontSize: normalize(1),
      marginLeft: 5,
    },
    icon: {
      alignSelf: 'center',
    },
  },
  // tv
  {
    container: {
      marginLeft: '2%',
      paddingBottom:10
    },
    focusButton: {
      width: width,
      alignSelf:'flex-start',
    },
    wrapper: {
      borderRadius: 5,
      backgroundColor: '#0066ff',
      justifyContent: 'center',
      flexDirection: 'row',
      paddingHorizontal: 10,
      height: normalize(3),
      width: 200,
    },
    text: {
      color: white,
      justifyContent: 'center',
      alignSelf: 'center',
      fontSize:normalize(1),
      marginLeft: 5,
    },
    icon: {
      alignSelf: 'center',
    },
  },
  // mobile
  {
    container: {
      marginLeft: '2%',
      paddingBottom:10
    },
    focusButton: {
      width: width,
      alignSelf:'center',
    },
    wrapper: {
      borderRadius: 5,
      backgroundColor: '#0066ff',
      justifyContent: 'center',
      flexDirection: 'row',
      paddingHorizontal: 10,
      height: normalize(4),
      width: 100,
    },
    text: {
      color: white,
      justifyContent: 'center',
      alignSelf: 'center',
      fontSize:normalize(1.4),
      marginLeft: 5,
    },
    icon: {
      alignSelf: 'center',
    },
  },
);