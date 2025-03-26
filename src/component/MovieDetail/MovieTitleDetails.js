import React, {useEffect, useState, useMemo} from 'react';
import PropTypes from 'prop-types';
import {View, Text, Platform} from 'react-native';
import {white, yellow} from '../../helper/Color';
import {normalize} from '../../helper/FontSize';
import {ImageIcon} from '../Icon/icon';
import {useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';
const MovieTitle = ({font_color, liveData}) => {
  const [fontColor, setFontColor] = useState(font_color || white);
  // const movieDetail = useSelector(state => state.movie.detail);
  // const {movieData = {}} = movieDetail;

  const route = useRoute();
  const {id} = route.params;
  const {movieDetailData} = useSelector(state => state.movie);
  let movieDetail = movieDetailData.find(data => data.movieData.id === id);
  let movieData = liveData ? liveData : movieDetail?.movieData || {};
  const genres = useMemo(
    () => movieData.genres?.slice(0, 3) || [],
    [movieData.genres],
  );

  const genre = useMemo(
    () =>
      genres.map((item, index) => (
        <Text key={item.name}>
          {item.name}
          {genres.length > index + 1 ? ', ' : ''}
        </Text>
      )),
    [genres],
  );

  const getFontSize = fontSize => {
    if (Platform.OS === 'web') {
      return normalize(fontSize - 0.2);
    }
    return normalize(fontSize);
  };

  const time = () => {
    if (movieData.runtime) {
      let runtime = parseInt(movieData.runtime);
      var hours = Math.floor(runtime / 60);
      var minutes = runtime % 60;
      return `${hours}h${minutes}m`;
    } else {
      return null;
    }
  };

  useEffect(() => {
    setFontColor(font_color);
  }, [font_color]);

  const styles = {
    container: {
      paddingLeft: 10,
      marginTop: 0,
    },
    title: {
      fontFamily: 'Montserrat-bold',
      fontSize: getFontSize(3),
      color: fontColor,
    },
    detailContainer: {
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    detailText: {
      fontFamily: 'Montserrat-medium',
      fontSize: getFontSize(1.3),
      color: fontColor,
      marginRight: 5,
      marginHorizontal: 5,
      borderRadius: 5,
    },
    bookmarkText: {
      fontFamily: 'Montserrat-medium',
      fontSize: getFontSize(1.1),
      color: fontColor == '#FFFFFF' ? '#000000' : '#ffffff',
      padding: 3,
      backgroundColor: `${fontColor}99`,
      borderRadius: 5,
      marginHorizontal: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    bookmarkIcon: {
      alignSelf: 'center',
    },
    bookmarkLabel: {
      marginLeft: 5,
      fontSize: getFontSize(1.1),
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{movieData.title}</Text>

      <View style={styles.detailContainer}>
        <Text style={styles.detailText}>
          {movieData.release_date ? movieData.release_date.split('-')[0] : ''}
        </Text>
        <Text style={styles.detailText}>{time()}</Text>
        <Text style={styles.detailText}>{genre}</Text>
        <Text style={styles.bookmarkText}>PG-13</Text>
        <Text style={styles.bookmarkText}>
          <ImageIcon
            name={'bookmark'}
            solid={true}
            size={getFontSize(1.1)}
            color={yellow}
            style={styles.bookmarkIcon}
          />
          <Text style={styles.bookmarkLabel}>In watchlist</Text>
        </Text>
      </View>
    </View>
  );
};

export default MovieTitle;

MovieTitle.propTypes = {
  movieData: PropTypes.object,
  font_color: PropTypes.string,
};
