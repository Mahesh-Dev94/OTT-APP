import React from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, TouchableHighlight, Image} from 'react-native';
import {getImageUrl} from '../api/url';
import Images from './Utils/ImageComponent';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setGlobalID} from '../../redux/reducers/globalSlice';


const MoviePoster = ({
  item,
  height,
  width,
  onMovieFocus,
  call_from,
  isLive,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const globalID = useSelector(state => state.global.globalID);

  const handlePress = () => {
    dispatch(setGlobalID(item.id));
    if (isLive) {
      navigation.push('Player', {
        isLive: isLive,
        url: item.mediaUrl,
        liveData: item,
      });
    } else {
      navigation.push('MovieDetail', {id: item.id});
    }
  };

  return (
    <TouchableHighlight
      activeOpacity={1}
      isTVSelectable={true}
      hasTVPreferredFocus={globalID === item.id}
      tvParallaxProperties={{
        enabled: true,
        shiftDistanceX: 1.7,
        shiftDistanceY: 1.7,
        tiltAngle: 0.01,
        magnification: 1.15,
      }}
      underlayColor={'transparent'}
      onPress={handlePress}
      onFocus={onMovieFocus}>
      <View style={styles.imageContainer}>
        <Images
          style={{
            height: isLive ? width : height,
            width: isLive ? width : width,
            borderRadius: isLive ? width : 10,
          }}
          resizeMode="cover"
          source={getImageUrl(item.poster_path)}
        />
      </View>
    </TouchableHighlight>
  );
};

export default MoviePoster;

MoviePoster.propTypes = {
  item: PropTypes.any,
  height: PropTypes.number,
  width: PropTypes.number,
  navigation: PropTypes.any,
  type: PropTypes.oneOf(['tv', 'movie']),
  onMovieFocus: PropTypes.func,
  progress: PropTypes.any,
  call_from: PropTypes.any,
};

MoviePoster.defaultProps = {
  height: 275,
  width: 175,
};

const styles = StyleSheet.create({
  imageContainer: {
    margin: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
