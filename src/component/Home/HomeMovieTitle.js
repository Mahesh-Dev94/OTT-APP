import React from 'react';
import {View, Text} from 'react-native';
import {white} from '../../helper/Color';
import {normalize} from '../../helper/FontSize';
import CreateResponsiveStyle from '../../helper/responsiveStyle';
import {useSelector} from 'react-redux';

const MovieTitle = ({hideView = false, carouselData = undefined}) => {
  const movieDetail = useSelector(state => state.movie.detail);
  const selectedMovieDetailHome = useSelector(
    state => state.swimlane.selectedMovieDetailHome,
  );
  const movieData = carouselData ? carouselData : selectedMovieDetailHome || {};
  if (hideView) return null;
  if (selectedMovieDetailHome === undefined) return null;
  return (
    <View style={Styles.container}>
      <Text style={Styles.screenTitle}>{movieData?.original_title}</Text>
      <View style={{flexDirection: 'row', marginTop: 3}}>
        <Text style={Styles.subTitle}>
          {movieData?.adult ? '18+' : 'G'} |{' '}
          {movieData?.release_date ? movieData?.release_date.split('-')[0] : ''}{' '}
          |{' '}
          {movieData?.original_language
            ? movieData?.original_language.toUpperCase()
            : ''}
        </Text>
      </View>
    </View>
  );
};

export default React.memo(MovieTitle);

const Styles = CreateResponsiveStyle(
  {
    // web
    screenTitle: {
      fontFamily: 'Montserrat-Bold',
      fontSize: normalize(3),
      color: white,
    },
    subTitle: {
      fontFamily: 'Montserrat-Bold',
      fontSize: normalize(1.5),
      color: white,
    },
    container: {
      marginLeft: '2%',
      marginTop: '1%',
    },
  },
  {
    //tv
    screenTitle: {
      fontFamily: 'Montserrat-Bold',
      fontSize: normalize(3),
      color: white,
    },
    subTitle: {
      fontFamily: 'Montserrat-Bold',
      fontSize: normalize(1.5),
      color: white,
    },
    container: {
      marginLeft: '2%',
      marginTop: '1%',
    },
  },
  {
    //mobile
    screenTitle: {
      fontFamily: 'Montserrat-Bold',
      fontSize: normalize(1.5),
      color: white,
    },
    subTitle: {
      fontFamily: 'Montserrat-Bold',
      fontSize: normalize(1.5),
      color: white,
    },
    container: {
      marginLeft: '.5%',
      marginTop: '1%',
    },
  },
);
