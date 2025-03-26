import React, {useEffect, useState,useRef} from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import {getImageUrl} from '../../api/url';
import {black, transparent} from '../../helper/Color';
import Video from 'react-native-video';
import Images from '../Utils/ImageComponent';

const MovieBackdrop = ({backdrop, children, URL, _OnProgress}) => {
  const url = getImageUrl(backdrop, 'uri', 'original');
  const isFocused = useIsFocused();
let player = useRef(null)

  const [timer, setTimer] = useState(false);

  useEffect(() => {
    console.log(
      'mobile WEb useEffect called URL-------------------------------',
      URL,
    );
    // setTimer(false);
    // let setTime = setTimeout(() => {
    //   setTimer(true);
    //   clearTimeout(setTime);
    // }, 3000);

    // return clearTimeout(setTime);
  }, [URL]);

  // useEffect(() => {
  //   if(Platform.OS === 'web'){
  //     if (isFocused) {
  //       setTimer(true);
  //     } else {
  //       setTimer(false);
  //     }
  //   }
  //     // Play the video when the screen comes into focus
  //     if(Platform.OS!=='web')
  //     if (isFocused && player.current) {
  //       player.current?.player.ref.setNativeProps({ paused: false })
  //     }
  
  //     // Pause the video when the screen goes out of focus
  //     return () => {
  //       if(Platform.OS!=='web')
  //       if (player.current) {
  //         player.current?.player.ref.setNativeProps({ paused: true })
  //       }
  //     };
    
  // }, [isFocused]);

  const handleProgress = progress => {
    _OnProgress(progress);
  };
  if (Platform.OS === 'web') {
    return (
      <View style={web_styles.container}>
        {/* {!timer ? ( */}
          <Images
            source={url}
            resizeMode={'cover'}
            style={web_styles.imageStyle}
          />
        {/* ) : (
          URL? <View style={_styles.imageStyleVod}>
            <Video
              control={false}
              ref={player}
              repeat={false}
              webConfig={{
                chromeless: true,
              }}
              source={{
                uri: URL,
                type: 'm3u8',
              }}
              height={500}
              onEnd={() => {
                setTimer(false);
              }}
            />
          </View>: <Images
            source={url}
            resizeMode={'cover'}
            style={web_styles.imageStyle}
          />
        )} */}
        <LinearGradient
          colors={['transparent', 'black', 'black']}
          locations={[0.45, 0.9]}
          style={web_styles.web_grad1}
        />
        <LinearGradient
          colors={['transparent', 'transparent', 'black']}
          start={{x: 1, y: 0}}
          end={{x: 0, y: 0}}
          style={web_styles.grad2}
        />
        <View>{children}</View>
      </View>
    );
  }
  return (
    <View style={_styles.container}>
       <Images source={url} resizeMode={'cover'} style={_styles.imageStyle} />
      {/* {!timer ? (
        <Images source={url} resizeMode={'cover'} style={_styles.imageStyle} />
      ) : (
        URL?  <Video
          poster={url.uri}
          controls={false}
          posterResizeMode={'cover'}
          resizeMode={'cover'}
          repeat={false}
          style={_styles.imageStyle}
          volume={0.1}
          ref={player}
          paused={false}
          muted={false}
          source={{
            uri: URL,
            type: 'm3u8',
          }}
          onEnd={() => {
            setTimer(false);
          }}
          onProgress={handleProgress}
        />:<Images source={url} resizeMode={'cover'} style={_styles.imageStyle} />
      )} */}
      <LinearGradient
        colors={[transparent, black]}
        locations={[0.45, 0.9]}
        style={_styles.gradientImage}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTopLeftRadius: 16,
        }}>
        {children}
      </View>
    </View>
  );
};

export default MovieBackdrop;

MovieBackdrop.propTypes = {
  backdrop: PropTypes.string,
  children: PropTypes.any,
  URL: PropTypes.string,
  _OnProgress: PropTypes.func,
};

const _styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height / 1.8,
  },
  imageStyleVod: {
    height: 199,
    width: Dimensions.get('window').width,
    position: 'absolute',
    zIndex: -2,
  },

  imageStyle: {
    flex: 1,
    height: Dimensions.get('window').width * 1.7777,
    width: Dimensions.get('window').width,
  },

  gradientImage: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
});

const web_styles = StyleSheet.create({
  container: {flex: 1, height: '100%'},

  imageStyle: {
    position: 'absolute',
    zIndex: -2,
    height: '30%',
    width: '100%',
  },
  web_grad1: {
    position: 'absolute',
    zIndex: -1,
    height: '30%',
    width: '100%',
  },
  grad2: {
    position: 'absolute',
    zIndex: -1,
    height: '30%',
    width: '100%',
  },
  gradientImage: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
});
