import React from "react";
import PropTypes from "prop-types";
import {View, Text} from 'react-native';
import {white} from '../../helper/Color';
import { normalize } from "../../helper/FontSize";
import { useSelector } from 'react-redux';
import CreateResponsiveStyle from '../../helper/responsiveStyle';

const MovieTitle = () => {
  const movieDetail = useSelector((state) => state.movie.detail);
  const movieData = movieDetail?.movieData || {};
  return (
    <View
      style={style.container}>
      <Text style={{fontFamily: 'Montserrat-Bold', fontSize: normalize(3), color: white}}>
        {movieData.original_title}
      </Text>
      <View
        style={{
          width: 30,
          height: 5,
          backgroundColor: white,
          marginTop: 4,
          marginBottom: 8,
        }}
      />
    </View>
  );
};

export default MovieTitle;

const style = CreateResponsiveStyle(
  //web
  {
    container: {
      marginHorizontal: '1.5%',
    },
  },
  // tv
  {
    container: {
      marginHorizontal: '4%',
    },
  },
  // mobile
  {
    container: {
      marginHorizontal:'1.5%',
    },
  },
);

MovieTitle.propTypes = {
  title: PropTypes.string,
};
