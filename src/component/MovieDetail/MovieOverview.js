import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Text, TouchableWithoutFeedback, Platform} from 'react-native';
import {useSelector} from 'react-redux';
import {Styles} from './Styles';

const MovieOverview = ({liveData}) => {
  const [textShown, setTextShown] = useState(false);
  const movieDetail = useSelector(state => state.movie.detail);
  // const {movieData = {}} = movieDetail;
  let movieData = liveData ? liveData : movieDetail?.movieData || {};
  if (!movieData.overview) return null;

  const handleTextPress = () => {
    setTextShown(!textShown);
  };

  const numberOfLines = Platform.select({
    web: undefined,
    default: textShown ? undefined : 4,
  });

  return (
    <TouchableWithoutFeedback onPress={handleTextPress}>
      <Text numberOfLines={numberOfLines} style={[Styles.textOverview]}>
        {movieData.overview}{' '}
      </Text>
    </TouchableWithoutFeedback>
  );
};

export default MovieOverview;

MovieOverview.propTypes = {
  overview: PropTypes.string,
  font_color: PropTypes.string,
};
