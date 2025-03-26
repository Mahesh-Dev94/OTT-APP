import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {View, Platform, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {getImageUrl} from '../../../api/url';
import {black, transparent} from '../../../helper/Color';
import Images from '../../Utils/ImageComponent';
import Carousel from '../Carousel.js';
import {styles} from './HomeMovieBackdrop.styles';
import {useSelector} from 'react-redux';

const MovieBackdrop = ({children}) => {
  const movieDetail = useSelector(state => state.movie.detail);
  const selectedMovieDetailHome = useSelector(
    state => state.swimlane.selectedMovieDetailHome,
  );
  const movieData = selectedMovieDetailHome || {};
  const url = useMemo(
    () => getImageUrl(movieData.backdrop_path),
    [movieData.backdrop_path],
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.wrapper}>
        <ScrollView
          removeClippedSubviews={false}
          style={styles.wrapper}
          bounces={false}>
          <View style={styles.scrollWrapper}>
            <Images
              source={url}
              resizeMode={'cover'}
              style={styles.imageStyle}
            />
            <LinearGradient
              colors={[transparent, black, black]}
              locations={[0.45, 0.9]}
              style={styles.linear_grad}
            />
            <LinearGradient
              colors={[transparent, black, black]}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              style={styles.linear_grad2}
            />
            <View>{children}</View>
          </View>
        </ScrollView>
      </View>
    );
  }
  if (Platform.isTV) {
    return (
      <View style={styles.wrapper}>
        <Images source={url} resizeMode={'cover'} style={styles.imageStyle} />
        <LinearGradient
          colors={[transparent, black]}
          locations={[0.45, 0.9]}
          style={styles.gradientTv}
        />
        <View style={styles.fixedPos}>
          <LinearGradient
            colors={[transparent, black]}
            end={{x: 0.0, y: 0.25}}
            start={{x: 1.5, y: 1.5}}
            locations={[0.25, 0.9]}
            style={styles.gradientTv}
          />
          {children}
        </View>
      </View>
    );
  }
  return (
    <View style={styles.wrapper}>
      <ScrollView
        removeClippedSubviews={false}
        style={styles.wrapper}
        bounces={false}>
        <View style={{width: '100%'}}>
          <Carousel />
          {children}
        </View>
      </ScrollView>
    </View>
  );
};

export default React.memo(MovieBackdrop);

MovieBackdrop.propTypes = {
  children: PropTypes.any,
};
