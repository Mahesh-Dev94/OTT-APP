import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  View,
  StyleSheet,
  Image,
  Platform,
  Easing,
  Animated,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {transparent} from '../../helper/Color';
import Video from 'react-native-video';
import {useIsFocused} from '@react-navigation/native';
import Images from '../Utils/ImageComponent';
var time = 0;
const MovieBackdrop = ({backdrop, bg_color, children, URL, isScroll}) => {
  const player = useRef(null);
  const isFocused = useIsFocused();
  const [animatedHeight] = useState(new Animated.Value(isScroll ? 0 : 800));
  const [isPausedVideo, setVideoPaused] = useState(false); // Pause video when not in focus

  const leftGradient =
    Platform.OS === 'web'
      ? [
          transparent,
          transparent,
          bg_color ? bg_color : '#4d5152',
          bg_color ? bg_color : '#4d5152',
        ]
      : [transparent, transparent, bg_color ? bg_color : '#4d5152'];

  const leftGradientStart =
    Platform.OS === 'web' ? {x: 1, y: 0} : {x: 1.2, y: 0.8};
  const leftGradientEnd = Platform.OS === 'web' ? {x: 0, y: 0} : null;

  // useEffect(() => {
  //   // if(currentTime > 0 ){
  //   //   timer.current=true;
  //   //   // console.log(timer.current,'--if currentTime--',currentTime, !timer.current?'image':'video')
  //   // }else{
  //   //   timer.current=false;
  //   console.log(URL, '--else currentTime--', currentTime, timer ?  'video':'image' )
  //   let setTime = setTimeout(() => {
  //     setTimer(true);
  //     console.log('setTimeout--', currentTime, timer ?  'video':'image' )
  //     clearTimeout(setTime);

  //   }, 5000);
  //   // }
  // }, [])

  useEffect(() => {
    console.log('trailer::',URL)
    // Play the video when the screen comes into focus
    if(Platform.OS!=='web')
    if (isFocused && player.current) {
      player.current?.player.ref.setNativeProps({ paused: false })
      // console.log('player.current------',player.current)
    }

    // Pause the video when the screen goes out of focus
    return () => {
      if(Platform.OS!=='web')
      if (player.current) {
        player.current?.player.ref.setNativeProps({ paused: true })
        // console.log('player.current------',player.current)
      }
    };
  }, [isFocused]);

  // const updateCurrent = shouldPause => {
  //   if (Platform.OS === 'web') {
  //   } else {
  //     player.current?.player.ref.setNativeProps({paused: shouldPause});

  //     //
  //   }
  // };

  useEffect(() => {
    setVideoPaused(!isFocused); // Pause video when screen is not in focus
  }, [isFocused]);

  useEffect(() => {
    // Animate the height change when isScroll changes
    Animated.timing(animatedHeight, {
      toValue: isScroll ? 0 : 800, // Set the target height
      duration: 700, // Animation duration in milliseconds
      easing: Easing.ease, // Easing function for a smooth transition
      useNativeDriver: false, // Set to false when animating height
    }).start();
  }, [isScroll]);

  return (
    <View style={_styles.container}>
      {Platform.OS==='web'?
      <ScrollView style={_styles.scrollWrapper}>
      {/* <Animated.View style={{height: animatedHeight}}> */}
        {
          // timer ?(
          URL ? (
            <Video
              ref={ref => (player.current = ref)}
              webConfig={{
                chromeless: true,
              }}
              height={600}
              poster={backdrop.uri}
              posterResizeMode={'cover'}
              control={false}
              resizeMode={'cover'}
              // paused={true}
              // muted={false}
              paused={isPausedVideo}
              source={{
                uri: URL,
                type: 'm3u8',
              }}
              onLoad={() => {
                // if(currentTime>0){
                //   player.current?.player.ref.seek(currentTime?currentTime:0)
                // }
              }}
              onEnd={() => {
                // setTimer(false)
              }}
              onError={e => console.log('on error---', e)}
            />
          ) : (
            <Images
              source={backdrop}
              resizeMode={'cover'}
              style={[
                _styles.imageStyle,
                !Platform.isTV && Platform.OS !== 'web' ? {opacity: 0.3} : null,
              ]}
            />
          )

          //      :(backdrop ? (
          //   <Images
          //     source={backdrop}
          //     resizeMode={'cover'}
          //     style={[
          //       _styles.imageStyle,
          //       !Platform.isTV && Platform.OS !== 'web' ? { opacity: 0.3 } : null,
          //     ]}
          //     // onLoadStart={() => { console.log('Image Load Start Time===', timeStamp) }}
          //     // onLoad={() => console.log('Image Load time ===', new Date().getTime(), '  Total--', (new Date().getTime()) - timeStamp)}
          //   />
          // )
          // : null)
        }
      {/* </Animated.View> */}

      {Platform.OS === 'web' ? (
        <LinearGradient
          colors={leftGradient}
          end={leftGradientEnd}
          start={leftGradientStart}
          style={_styles.gradientImage}
        />
      ) : (
        <LinearGradient
          colors={leftGradient}
          start={leftGradientStart}
          style={_styles.gradientImage2}
        />
      )}
      {Platform.OS === 'web' ? (
        <LinearGradient
          colors={leftGradient}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={_styles.gradientImage}
        />
      ) : (
        <LinearGradient
          colors={[transparent, bg_color]}
          locations={Platform.isTV ? [0.45, 0.6] : [0.45, 0.9]}
          style={_styles.gradientImage}
        />
      )}

      {children}
      </ScrollView> : 
    <> 
    <Animated.View style={{height: animatedHeight}}> 
        {
          // timer ?(
          URL ? (
            <View style={{flex: 1, width: "70%", height: 600, alignSelf: "flex-end"}}>
            <Video
              ref={ref => (player.current = ref)}
              webConfig={{
                chromeless: true,
              }}
              height={600}
              poster={backdrop.uri}
              posterResizeMode={'cover'}
              control={false}
              resizeMode={'cover'}
              // paused={true}
              // muted={true}
              paused={isPausedVideo}
              source={{
                uri: URL,
                type: 'm3u8',
              }}
              onLoad={() => {
                // if(currentTime>0){
                //   player.current?.player.ref.seek(currentTime?currentTime:0)
                // }
              }}
              onEnd={() => {
                // setTimer(false)
              }}
              onError={e => console.log('on error---', e)}
            />
            </View>
          ) : (
            <View style={{flex: 1, width: "70%", height: 600, alignSelf: "flex-end"}}>
            <Images
              source={backdrop}
              resizeMode={'cover'}
              style={[
                _styles.imageStyle,
                !Platform.isTV && Platform.OS !== 'web' ? {opacity: 0.3} : null,
              ]}
            />
            </View>
          )

          //      :(backdrop ? (
          //   <Images
          //     source={backdrop}
          //     resizeMode={'cover'}
          //     style={[
          //       _styles.imageStyle,
          //       !Platform.isTV && Platform.OS !== 'web' ? { opacity: 0.3 } : null,
          //     ]}
          //     // onLoadStart={() => { console.log('Image Load Start Time===', timeStamp) }}
          //     // onLoad={() => console.log('Image Load time ===', new Date().getTime(), '  Total--', (new Date().getTime()) - timeStamp)}
          //   />
          // )
          // : null)
        }
      </Animated.View>

      {Platform.OS === 'web' ? (
        <LinearGradient
          colors={leftGradient}
          end={leftGradientEnd}
          start={leftGradientStart}
          style={_styles.gradientImage}
        />
      ) : (
        <LinearGradient
          colors={leftGradient}
          start={leftGradientStart}
          style={_styles.gradientImage2}
        />
      )}
      {Platform.OS === 'web' ? (
        <LinearGradient
          colors={leftGradient}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={_styles.gradientImage}
        />
      ) : (
        <LinearGradient
          colors={[transparent, bg_color]}
          locations={Platform.isTV ? [0.45, 0.6] : [0.45, 0.9]}
          style={_styles.gradientImage}
        />
      )}

      {children}
      </>}
      
    </View>
  );
};

export default MovieBackdrop;

MovieBackdrop.propTypes = {
  backdrop: PropTypes.any,
  bg_color: PropTypes.string,
  children: PropTypes.any,
  URL: PropTypes.string,
  currentTime: PropTypes.any,
  isScroll: PropTypes.any,
};

const _styles = StyleSheet.create({
  container: {
    // height: Dimensions.get('window').height,
    height:'100%',
    flex:1
  },
  scrollWrapper: {flex: 1, height: '100%'},
  imageStyle: {
    flex: 1,
    height:'30%', 
  },

  gradientImage: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  gradientImage2: {
    position: 'absolute',
    height: '100%',
    width: '85%',
  },
});
