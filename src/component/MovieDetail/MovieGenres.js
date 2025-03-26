import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";
import { darkBlue } from "../../helper/Color";
import { normalize } from "../../helper/FontSize";
import { useSelector } from 'react-redux';
const MovieGenres = () => {
  const movieDetail = useSelector((state) => state.movie.detail);
  const movieData = movieDetail?.movieData || {};

  const component = React.useMemo(() => {
    // if (hideView) return [];
    if(Array.isArray(movieData.genres)){
      return movieData.genres.map((item, index) => (
        <View key={index} style={_styles.view}>
          <Text style={_styles.text}>{item.name}</Text>
        </View>
      ));
    }
  
  }, [movieData]);

  return <View style={_styles.container}>{component}</View>;
};

export default React.memo(MovieGenres);

MovieGenres.propTypes = {
  genre: PropTypes.array,
};

MovieGenres.defaultProps = {
  genre: [],
};

const _styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "70%",
  },

  view: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 0.75,
    borderColor: darkBlue,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },

  text: {
    color: darkBlue,
    fontFamily: "Montserrat-Light",
    fontSize: normalize(1),
  },
});
