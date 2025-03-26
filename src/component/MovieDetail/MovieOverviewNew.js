import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Text, TouchableWithoutFeedback, Platform, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Styles} from './Styles';
import {useRoute} from '@react-navigation/native';

const MovieOverview = ({font_color}) => {
  const [textShown, setTextShown] = useState(false);
  // const movieDetail = useSelector(state => state.movie.detail);
  const route = useRoute();
  const {id} = route.params;
  const {movieDetailData} = useSelector(state => state.movie);
  let movieDetail = movieDetailData.find(data => data.movieData.id === id);
  // const {movieData = {}} = movieDetail;
  const movieData = movieDetail?.movieData || {};
  if (!movieData.overview) return null;

  const handleTextPress = () => {
    setTextShown(!textShown);
  };

  const numberOfLines = Platform.select({
    web: undefined,
    default: textShown ? undefined : 4,
  });

  return (
    <View>
      <Text
        numberOfLines={numberOfLines}
        style={[Styles.textOverview, {color: font_color}]}>
        {movieData.overview}{' '}
      </Text>
    </View>
  );
};

export default MovieOverview;

MovieOverview.propTypes = {
  overview: PropTypes.string,
  font_color: PropTypes.string,
};
