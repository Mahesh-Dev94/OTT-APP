import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Platform,
  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import InfoDetailView from './InfoDetailView';
import HomeMovieBackdrop from '../MovieDetailsBackdrop';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import Video from 'react-native-video';
import Images from '../../Utils/ImageComponent';
import { useSelector } from 'react-redux';
import { getImageUrl } from '../../../api/url';
import { DefaultFocus, SpatialNavigationScrollView } from 'react-tv-space-navigation';
import { black } from '../../../helper/Color';
import { getPlatformType, platformType } from '../../../helper/platformType';
import UserInfo from '../../Home/userInfo';
import AwesomeAlert from 'react-native-awesome-alerts';
const isWider = Platform.isTV || Platform.OS === 'web';
const offset= 300;   //Platform.isTV? Platform.OS==='ios'?300:210:250
export const InfoDetailContainer = props => {
  const navigation = useNavigation();
  const { bg_color, font_color } = props;
  const route = useRoute();
  const { id } = route.params;
  const [isPausedVideo, setVideoPaused] = useState(!isWider); // Pause video when not in focus
  const [isScroll, setScroll] = useState(false);
  const isFocused = useIsFocused();
  const player = useRef(null);
  const scrollViewRef = useRef(null);
  const { movieDetailData } = useSelector(state => state.movie);
  const [selectedMovieData, setSelectedMovieData] = useState(null);
  const [isPopupVisible,setisPopupVisible]=useState(false)
  useEffect(() => {
    setVideoPaused(!isFocused); // Pause video when screen is not in focus
  }, [isFocused]);
  useEffect(() => {
    if (movieDetailData.length > 0) {
      let selectedMovieDataIN = movieDetailData.find(
        data => data.movieData.id === id,
      );
      setSelectedMovieData(selectedMovieDataIN);
    }
  }, [isFocused, movieDetailData]);

  // const handleVideoLoad = () => {
  //   if (currentTime > 0) {
  //     player.current.seek(currentTime);
  //   }
  // };

  const handleVideoEnd = () => {
    setVideoPaused(true);
  };

  const handleScroll = event => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const contentHeight = contentSize.height;
    const screenHeight = layoutMeasurement.height;

    // Calculate the position as a percentage
    const scrollPercentage = (scrollY / (contentHeight - screenHeight)) * 100;

    // Check if it's 40% down
    if (scrollPercentage >= 50) {
      // Do something when scrolled to 40% down
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  const renderMedia = () => {
    if (selectedMovieData && selectedMovieData.movieData.mediaTrailer) {
      const url = getImageUrl(
        selectedMovieData.movieData.backdrop_path,
        'uri',
        'original',
      );
      return (
        <Video
          poster={url.uri}
          webConfig={{ chromeless: true }}
          posterResizeMode="cover"
          resizeMode="cover"
          repeat={false}
          paused={isPausedVideo}
          ref={player}
          style={style.imageStyle}
          // onLoad={handleVideoLoad}
          onEnd={handleVideoEnd}
          source={{
            uri: selectedMovieData.movieData.mediaTrailer,
            type: 'm3u8',
          }}
        />
      );
    } else if (selectedMovieData) {
      const url = getImageUrl(
        selectedMovieData.movieData.backdrop_path,
        'uri',
        'original',
      );
      return (
        <Images source={url} resizeMode="cover" style={style.imageStyle} />
      );
    } else {
      return null;
    }
  };

  if (isWider) {
    if (selectedMovieData === null) {
      return null;
    }
    const url = getImageUrl(
      selectedMovieData.movieData.backdrop_path,
      'uri',
      'original',
    );
    return (
      <HomeMovieBackdrop
        isScroll={isScroll}
        backdrop={url}
        bg_color={bg_color}
        URL={selectedMovieData?.movieData?.mediaTrailer}>
        <View style={style.container}>
          {/* <ScrollView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: 'transparent', flex: 1}}
            bounces={false}> */}
          <DefaultFocus>
            {Platform.OS==='web'? <InfoDetailView font_color={font_color} onAlert={()=>setisPopupVisible(true)} />:
           <SpatialNavigationScrollView style={{backgroundColor:'transparent'}} offsetFromStart={offset}>
              <InfoDetailView font_color={font_color} />
            </SpatialNavigationScrollView>}
          </DefaultFocus>
          {/* </ScrollView> */}
        </View>

        {  Platform.OS==='web' && <AwesomeAlert
          show={isPopupVisible}
          showProgress={false}
          title="Alert"
          message="This action requires you to log in first. Would you like to log in now?"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="cancel"
          confirmText="Ok"
          confirmButtonColor="#111"
          onCancelPressed={() => {
           setisPopupVisible(false);
          }}
          onConfirmPressed={() => {
            setisPopupVisible(false);
            navigation.navigate('SignIn');
          }}
          contentContainerStyle={{
            // flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            // backgroundColor: black,
          }}
        />}
      </HomeMovieBackdrop>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: 'black' }}>
      <View style={style.imageStyle}>
        {renderMedia()}
        <LinearGradient
          colors={['transparent', bg_color, bg_color]}
          locations={[0.2, 0.7589, 0.7589]}
          style={style.linearGradMob}
        />
         {/* {getPlatformType() === platformType.mobile && <UserInfo />} */}
      </View>
      <InfoDetailView font_color={font_color} />
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // justifyContent: 'flex-start',
    // backgroundColor: 'transparent',
  },
  imageStyle: {
    height: Dimensions.get('window').height / 3,
    width: Dimensions.get('window').width,
  },

  linearGradMob: {
    width: '100%',
    height: Platform.OS === 'ios' ? 200 : 80,
    position: 'absolute',
    zIndex: 10,
    bottom: 0,
  },
});
