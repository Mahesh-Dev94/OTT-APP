import React, {memo, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, Text, Platform, Dimensions} from 'react-native';
import {getImageUrl} from '../../api/url';
import {gray, white} from '../../helper/Color';
import {normalize} from '../../helper/FontSize';
import Images from '../Utils/ImageComponent';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setGlobalID} from '../../../redux/reducers/globalSlice';
import {FocusButton} from 'react-native-tv-selected-focus';
import { theme } from '../../../src1/design-system/theme/theme';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const height =theme.sizes.program.portrait.height   // windowHeight / 2.6;
const width = theme.sizes.program.portrait.width   //(windowWidth - 40) / 6;

const MoviePoster = memo(
  ({
    onMovieFocus,
    item,
    call_from,
    blockFocusRight,
    blockFocusLeft,
    isLive
  }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const globalID = useSelector(state => state.global.globalID);
    const hasFocus = useSelector(state => state.hasFocus.hasFocus);
    const [focusedID, setFocusedID] = useState(globalID);

    useEffect(() => {
      setFocusedID(globalID);
    }, [dispatch,globalID]);

    const handlePress = () => {
      dispatch(setGlobalID(item.id));
      if (isLive) {
        navigation.navigate('Player', {
          isLive: isLive,
          url: item.mediaUrl,
          liveData: item,
        });
      } else {
        navigation.navigate('MovieDetail', {id: item.id});
      }
      // const navigateScreen = isLive ? "Player"  'MovieDetail';
    };

    return (
      <FocusButton
        activeOpacity={1}
        isTVSelectable={true}
        blockFocusRight={blockFocusRight}
        blockFocusLeft={blockFocusLeft}
        hasTVPreferredFocus={focusedID === item.id}
        tvParallaxProperties={{
          enabled: true,
          shiftDistanceX: 1.7,
          shiftDistanceY: 1.7,
          tiltAngle: 0.01,
          magnification: 1.1,
        }}
        underlayColor={'transparent'}
        onPress={handlePress}
        onFocus={onMovieFocus}>
        <View style={[styles.container,{paddingBottom:isLive ? 25 : 25,alignItems:isLive ? 'center':'flex-end'}]}>
          <Images
            style={[
              styles.image,
              {
                height: isLive ? width : height,
                width: isLive ? width : width,
                borderRadius: isLive ? width : 10,
              },
              hasFocus === item.id ?{borderColor:'white',borderWidth:2}:null
            ]}
            resizeMode="cover"
            source={getImageUrl(item.poster_path)}
          />

          <Text numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
        </View>
      </FocusButton>
    );
  },
);

export default MoviePoster;

MoviePoster.propTypes = {
  item: PropTypes.any,
  call_from: PropTypes.any,
  blockFocusRight: PropTypes.any,
  blockFocusLeft: PropTypes.any,
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' || Platform.OS === 'web' ? 20 : 5,
  },
  image: {
    marginHorizontal: 10,
    backgroundColor: gray,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom:4,
    marginTop:10
  },
  title: {
    color: white,
    marginLeft: 20,
    fontSize: normalize(1.1),
    width: width,
  },
});
