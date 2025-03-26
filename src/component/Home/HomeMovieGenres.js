import React from 'react';
import PropTypes from 'prop-types';
import {View, Text} from 'react-native';
import {darkBlue} from '../../helper/Color';
import {normalize} from '../../helper/FontSize';
import CreateResponsiveStyle from '../../helper/responsiveStyle';
import {useSelector} from 'react-redux';

const MovieGenres = ({hideView = false}) => {
  const movieDetail = useSelector(state => state.movie.detail);
  const selectedMovieDetailHome = useSelector(
    state => state.swimlane.selectedMovieDetailHome,
  );
  const movieData = selectedMovieDetailHome || {};

  const component = React.useMemo(() => {
    if (hideView) return [];
    if (Array.isArray(movieData.genres)) {
      return movieData.genres.map((item, index) => (
        <View key={index} style={commonStyles.view}>
          <Text style={commonStyles.text}>{item.name}</Text>
        </View>
      ));
    }
  }, [hideView, movieData]);

  return <View style={_styles.container}>{component}</View>;
};

export default React.memo(MovieGenres);

MovieGenres.propTypes = {
  genre: PropTypes.array,
};

MovieGenres.defaultProps = {
  genre: [],
};

const commonStyles = {
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '70%',
  },
  view: {
    paddingHorizontal: 3,
  },
  text: {
    color: darkBlue,
    fontFamily: 'Montserrat-Medium',
    fontSize: normalize(1), //isTv ? 16 : 10
  },
};
const _styles = CreateResponsiveStyle(
  {
    container: {...commonStyles.container, marginLeft: '2%'},
  },
  {
    container: {...commonStyles.container, marginLeft: '2%'},
  },
  {
    container: {...commonStyles.container, marginLeft: '5%'},
  },
);
