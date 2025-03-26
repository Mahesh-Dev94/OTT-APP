import React from 'react';
import PropTypes from 'prop-types';
import {View, Text,StyleSheet} from 'react-native';
import {normalize} from '../../helper/FontSize';
import {useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';
import CreateResponsiveStyle from '../../helper/responsiveStyle';
const MovieTitle = ({font_color}) => {
  // const movieDetail = useSelector((state) => state.movie.detail);
  const route = useRoute();
  const {id} = route.params;
  const {movieDetailData} = useSelector(state => state.movie);
  let movieDetail = movieDetailData.find(data => data.movieData.id === id);
  const movieData = movieDetail?.movieData || {};
  return (
    <View style={styles.container}>
      <Row label="Director" value={movieData.director} fontColor={font_color} />
      <Row
        label="Writer"
        value={movieData.writers}
        fontColor={font_color}
        extraPadding
      />
    </View>
  );
};

const Row = ({label, value, fontColor, extraPadding}) => {

  if (value === null || value === undefined || value === '') return null;

  return (
    <View style={[styles.row, extraPadding && styles.extraPadding]}>
      <Text style={[styles.label, style.commonTextStyle,{color: fontColor}]}>{label}</Text>
      <Text style={[styles.text, style.commonTextStyle,{color: fontColor}]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingLeft: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  label: {
    width: '15%', // Adjust as needed
  },
  text: {
    flex: 1,
  },
  extraPadding: {
    paddingTop: 2,
  },
});

const style = CreateResponsiveStyle(
  //web
  {
    commonTextStyle:{
      fontFamily: 'Montserrat-Medium',
      fontSize: normalize(1.1),
    }
  },
  // tv
  {
    commonTextStyle:{
      fontFamily: 'Montserrat-Medium',
      fontSize: normalize(1.3),
    }
  },
  // mobile
  {
    commonTextStyle:{
      fontFamily: 'Montserrat-Medium',
      fontSize: normalize(1.3)
    }
  },
);

export default MovieTitle;

MovieTitle.propTypes = {
  details: PropTypes.shape({
    director: PropTypes.string,
    writers: PropTypes.string,
  }),
  font_color: PropTypes.string,
};

Row.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  fontColor: PropTypes.string,
  extraPadding: PropTypes.bool,
};
