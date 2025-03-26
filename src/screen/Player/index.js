import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  Dimensions,
  BackHandler,
  Platform,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import Video from 'react-native-video';
import Orientation, {
  LANDSCAPE,
  OrientationLocker,
  PORTRAIT,
  useOrientationChange,
  useDeviceOrientationChange
} from 'react-native-orientation-locker';
import {requestMediaMetaInfo} from '../../api/api';
import MovieOverview from '../../component/MovieDetail/MovieOverview';
import MovieCast from '../../component/MovieDetail/MovieCast';
import MovieDirector from '../../component/MovieDetail/MovieDirectorDetails';
import MovieTitle from '../../component/MovieDetail/MovieTitleDetails';
import {black, white} from '../../helper/Color';
import {dashMediaName, hlsMediaName, mediaOutput} from '../../api/url';
import {normalize} from '../../helper/FontSize';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
// import m3u8Parser from 'm3u8-parser';
// import RNFS from 'react-native-fs';
import M3U8FileParser from 'm3u8-file-parser';
import {useDispatch,useSelector} from 'react-redux';
import {fetchMovieDetailScreen} from '../../../redux/reducers/details';
import { setroute } from '../../../redux/reducers/routeName';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sethasSession } from '../../../redux/reducers/session';

 
const {trackPreRoll} = require('./trackData');
const isMobilePlatform =
  !Platform.isTV && (Platform.OS === 'android' || Platform.OS === 'ios');
 
const baseUrl =
  'https://8fcb71d491eb49bf84945d9adea26edb.mediatailor.us-west-2.amazonaws.com'; // e_channel
const mpd_asset_id =
  // 'fb04419077e345f682fb05a3f7cc77e7/64c179c9a6b04128ab4105d723012382/c2fa5c88342340349588b8dc8a73f0c4/index.mpd'; // (1920 × 1080)
  'b63d326ea7d24819a5288cafec54a020/64c179c9a6b04128ab4105d723012382/c2fa5c88342340349588b8dc8a73f0c4/index.mpd'; // ads with multiple resolution
const adType = {
  midRoll: 'midRoll',
  preRoll: 'preRoll',
  postRoll: 'postRoll',
};
 
function VideoPlayerView() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const session = useSelector(state => state.hasSession.hasSession);
  const [state, setState] = useState({
    movieData: {},
    credit: {},
    images: {},
    isLoaded: false,
    fullscreen: false,
    mediaFileHls: '',
    mediaFileDash: '',
    trackingUrl: null,
    randomNum: Math.floor(Math.random() * (6 - 1 + 1) + 1),
    trackUrlFromManifest: '',
  });
 
  const OnEnterHandleFullscreen=()=> {
    console.log('OnEnterHandleFullscreen')
    if (isMobilePlatform)
      state.fullscreen
        ?
         Orientation.unlockAllOrientations()
         :
        Orientation.lockToLandscapeLeft();
  }
 
  const OnExitHandleFullscreen=()=> {
    console.log('OnExitHandleFullscreen')
    if (isMobilePlatform) {
      setState({...state, fullscreen: false});
      Orientation.lockToPortrait();
    }
  }
 
 
  const handleMpdApi = async (mediaTailorurl = '', adOccuranceType) => {
    console.log("mediaTailorurl 111::", mediaTailorurl)
 
    const baseAdUrl = mediaTailorurl
      ? mediaTailorurl
      : `${baseUrl}/v1/session/9a39c1f787063acfe5de4814e922e22605c1572d/e_channel/${mpd_asset_id}`; // e_channel 20/jul/2022
    await fetch(baseAdUrl, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        adsParams: {
          deviceType: 'ipad',
        },
      }),
    })
      .then(response => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then(async data => {
        console.log("mediaTailorurl ::", mediaTailorurl, data)
        const prefix = mediaTailorurl.split("/v1")
        const manifest_url = `${prefix[0]}${data.manifestUrl}`;
        const tracking_url = `${prefix[0]}${data.trackingUrl}`;
        await fetch(manifest_url).then(response => {
          if (!response.ok) throw Error(response.statusText);
          return response.text();
        });
        const tracking_response = await fetch(tracking_url).then(response => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        });
        console.log('tracking_response', manifest_url,tracking_url );
        setState({
          ...state,
          trackingUrl: tracking_response,
          mediaFileDash: manifest_url,
          mediaFileHls: manifest_url,
          trackUrlFromManifest: tracking_url,
 
          isLoaded: true,
        });
      })
      .catch(error => {
        console.log('error adads', error);
      });
  };
 
  const callbackMediaMeta = response => {
    // console.log('callbackMediaMeta----',response)
    const dashMedia = mediaOutput(response.mediaFileOutputs, dashMediaName);
    const hlsMedia = mediaOutput(response.mediaFileOutputs, hlsMediaName);
 
    const adInfo = response.adInformation;
    let adOccuranceType = '';
    if (adInfo.isMidRollAdAvail) {
      adOccuranceType = adType.midRoll;
    } else if (adInfo.isPostRollAdAvail) {
      adOccuranceType = adType.postRoll;
    } else if (adInfo.isPreRollAdAvail) {
      adOccuranceType = adType.preRoll;
    }
    if (Platform.OS !== "web" && adOccuranceType) {
      let mediaVal = Platform.OS === 'android' ? dashMedia : hlsMedia;
      if (
        Platform.OS === 'android' &&
        adType.midRoll &&
        dashMedia &&
        dashMedia.includes('index.mpd')
      ) {
        mediaVal = dashMedia;
        handleMpdApi(mediaVal, adOccuranceType);
      } else if (Platform.OS === 'ios' && adType.midRoll) {
        handleMpdApi(mediaVal, adOccuranceType);
      } else {
        handleMpdApi(mediaVal, adOccuranceType);
      }
    } else {
      // if Stream has mpd then set mpd otherwise set hls for android
      setState({
        ...state,
        mediaFileHls: hlsMedia,
        mediaFileDash: dashMedia,
        isLoaded: false,
      });
    }
  };
 
  const callbackRequest = response => {
    setState({
      ...state,
      movieData: response['movieData'],
      credit: response['credits'],
      recommendations: response['recommendations'],
      isLoaded: true,
    });
  };
 
  const LogOut = async () => {
    await AsyncStorage.removeItem('user');
    dispatch(sethasSession(''));
  };

  const requestInfoDetail = async () => {
    const {id, mediaUuid} = route.params;
    try {
      // console.log('id', id);
      // if (id === 'b51c41a8-d7aa-44cf-a3be-ebd09eeabb21') {
      //   handleMpdApi();
      //   return;
      // }
      // console.log('AccessToken-----',session)
      await requestMediaMetaInfo(mediaUuid,session?.AccessToken, callbackMediaMeta);
      if (isMobilePlatform) {
        dispatch(fetchMovieDetailScreen({id: id, type: true}));
      }
    } catch (error) {
      console.log('webUrlError', error);
      LogOut();
    }
  };
 
 
 
  async function handleTrackingApi() {
    if (state.trackingUrl && state.trackingUrl.avails.length > 0) {
      return;
    }
 
    try {
      const tracking_response = await fetch(state.trackUrlFromManifest).then(
        response => {
          if (!response.ok) throw Error(response.statusText);
 
          return response.json();
        },
      );
 
      setState({
        ...state,
        trackingUrl: tracking_response,
      });
    } catch (error) {
      console.log('error', error);
    }
  }
 
  function handleBackButtonClick() {
    if (isMobilePlatform) OnExitHandleFullscreen();
  }
 
  // useOrientationChange(o => {
  //   // console.log('hii');
  //   // _onOrientationDidChange();
  //   // Handle orientation change
  // });
 
  // useDeviceOrienta/tionChange(o => {
  // console.log('hii __+++___');
  // _onOrientationDidChange();
  // Handle device orientation change
  // });
 
  useEffect(() => {
    const {isLive, url} = route.params;
    if (isLive) {
      setState({mediaFileHls: url, mediaFileDash: url});
    } else {
      requestInfoDetail();
    }
    // console.log('m3u8Parser', m3u8Parser);
    // var parser = new m3u8Parser.Parser();
 
    // RNFS.downloadFile({
    //   fromUrl:
    //     'https://b6d76811d0c6e6deca3d996b9ed217a8.egress.mediapackage-vod.us-west-2.amazonaws.com/out/v1/b494f5bc157d4f0b9b61b122f6614b84/961f20833e764911bcec6ed14eea7438/a2fb3565f1e04cd4b4a4d2a8fe4a6ab8/index.m3u8',
    //   toFile: RNFS.DocumentDirectoryPath + '/test1.txt',
    // })
    //   .promise.then(async response => {
    //     console.log('File downloaded!', response);
    //     const data = await RNFS.readFile(
    //       RNFS.DocumentDirectoryPath + '/test1.txt',
    //     );
 
    //     const reader = new M3U8FileParser();
    //     reader.read(data);
    //     const result = reader.getResult(); // Get the parse result
    //     console.log('data', data);
    //     console.log('result', result.segments);
    //   })
    //   .catch(err => {
    //     console.log('Download error:', err);
    //   });
 
    // console.log('draa', downloadJob);
 
    // parser.push(
    //   'https://cdn.theoplayer.com/video/elephants-dream/playlist.m3u8',
    // );
    // parser.end();
    BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    // if (isMobilePlatform) {
    //   Orientation.addOrientationListener(_onOrientationDidChange);
    //   Orientation.unlockAllOrientations();
    // }
    dispatch(setroute('player'))
    return () => {
      if (isMobilePlatform) {
        Orientation && Orientation.lockToPortrait();
      }
    };
  }, []);
 
  const movieInfoGeneral = () => {
    const {isLive} = route.params;
    let container =
      Platform.OS === 'web' || Platform.isTV
        ? Styles.webStyle
        : state.fullscreen
          ? Styles.fullscreenVideo
          : {...Styles.video};
 
    if (
      state.mediaFileHls === '' &&
      state.mediaFileDash === '' &&
      state.trackingUrl === null
    ) {
      return (
        <View
          style={[container, {alignItems: 'center', justifyContent: 'center'}]}>
          <ActivityIndicator size="small" color={'white'} />
        </View>
      );
    }
    const url =
      Platform.OS === 'web' || Platform.OS === 'android'
        ? state.mediaFileDash
        : state.mediaFileHls;
    console.log("url ::", url)
    return (
      <View style={container}>
        {url !== '' ? (
          <Video
            control={true}
            fullscreen={state.fullscreen}
            isLive={isLive}
            source={{
              // uri:'https://b6d76811d0c6e6deca3d996b9ed217a8.egress.mediapackage-vod.us-west-2.amazonaws.com/out/v1/700829bf41a245a48f85a16300d54f69/64c179c9a6b04128ab4105d723012382/c2fa5c88342340349588b8dc8a73f0c4/index.mpd'
              // uri: https://10380e91fda5e303.mediapackage.us-west-2.amazonaws.com/out/v1/02b3471b153d403582ad7d55e9dc6800/index.m3u8
              // uri: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
              // uri: 'https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8',
              uri: url
              // uri: 'https://10380e91fda5e303.mediapackage.us-west-2.amazonaws.com/out/v1/02b3471b153d403582ad7d55e9dc6800/index.m3u8',
              // uri: 'https://10380e91fda5e303.mediapackage.us-west-2.amazonaws.com/out/v1/07d17f3dadd04eafa9bd6cc6f6fcc801/index.mpd',
              //https://10368c5f41df4fb4b0689d2b90e2c7f2.mediatailor.us-west-2.amazonaws.com/v1/session/9a39c1f787063acfe5de4814e922e22605c1572d/single_ad/6fd21c05275845e2bb67f2a3ccac3605/3222cd28d72744cf86b09f568fa77418/dfadea49cd1647be8c684e1002969cad/index.mpd
            }}
            pictureInPicture={!Platform.isTV}
            trackingJson={state.trackingUrl}
            onBack={() => {
              setState({...state, fullscreen: false});
              !Platform.isTV && Orientation.lockToPortrait();
              navigation.goBack();
            }}
            isFocused={isFocused}
            resizeMode={'cover'}
            onEnterFullscreen={() => OnEnterHandleFullscreen()}
            onExitFullscreen={() => OnExitHandleFullscreen()}
            toggleResizeModeOnFullscreen={false}
            style={container}
            webConfig={{
              chromeless: true,
            }}
            onError={e => {
              console.log('ERR', e);
            }}
            onPlayer={true}
            onLoad={e => {
              setTimeout(() => {
                handleTrackingApi();
              }, 5000);
            }}
          />
        ) : (
          <View
            style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
            <Text style={{color: white, fontSize: normalize(1.4)}}>
              Unfortunately, the stream is currently unavailable!
            </Text>
          </View>
        )}
 
 
        {/* <View style={[container,{backgroundColor:'red',marginTop:40}]}>
      <TouchableOpacity onPress={() => OnEnterHandleFullscreen()} style={{height:50,width:170}}>
         <Text>OnEnterHandleFullscreen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => OnExitHandleFullscreen()} style={{height:50,width:170}}>
        <Text>OnExitHandleFullscreen</Text>
        </TouchableOpacity>
        </View> */}
      </View>
    );
  };
 
  const movieInfoDetail = () => {
    const {movieData, credit, isLoaded} = state;
    const {liveData, isLive} = route.params;
    return (
      <View style={Styles.movieDetailWrapper}>
        <View style={Styles.movieDetail}>
          {/* {isLoaded && ( */}
          <View>
            <MovieTitle liveData={liveData} font_color={white} />
            <MovieOverview liveData={liveData} />
            {!isLive && <MovieDirector font_color={white} />}
            {!isLive && <MovieCast />}
          </View>
          {/* )} */}
        </View>
      </View>
    );
  };
 
  return (
    <View style={{flex: 1, backgroundColor: black}}>
      {isMobilePlatform && (
        <StatusBar translucent backgroundColor={'transparent'} />
      )}
      {!Platform.isTV && Platform.OS !== 'web' && (
        <OrientationLocker
          orientation={state.fullscreen ? LANDSCAPE : PORTRAIT}
          onChange={orientation => {
            console.log('--orientation fullscreen--',state.fullscreen)
            if (orientation !== PORTRAIT) {
              setState({...state, fullscreen: true});
            } else {
              setState({...state, fullscreen: false});
            }
          }}
          onDeviceChange={orientation =>
            console.log('onDeviceChange', orientation)
          }
        />
      )}
 
      <ScrollView scrollEnabled={!state.fullscreen} style={Styles.scrollview}>
        {movieInfoGeneral()}
        {isMobilePlatform && !state.fullscreen && movieInfoDetail()}
      </ScrollView>
    </View>
  );
}
 
export default VideoPlayerView;
 
VideoPlayerView.propTypes = {
  route: PropTypes.any,
  navigation: PropTypes.object,
};
 
const Styles = StyleSheet.create({
  scrollview: {
    backgroundColor: black,
    flexGrow: 1,
  },
  container: {
    height: Dimensions.get('window').height / 2.5,
    backgroundColor: black,
  },
 
  movieDetailWrapper: {
    flex: 1,
    backgroundColor: black,
  },
 
  movieDetail: {
    padding: 16,
    paddingTop: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: black,
  },
  video: {
    height: Dimensions.get('window').width * (9 / 12),
    width: Dimensions.get('window').width,
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    height: Dimensions.get('screen').width,
    width: Dimensions.get('screen').height,
    backgroundColor: 'black',
  },
  webStyle: {
    flex: 1,
    backgroundColor: 'black',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
});