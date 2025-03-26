import React, {useState} from 'react';
import {
  View,
  Text,
  Animated,
  LayoutAnimation,
} from 'react-native';
import {white} from '../../helper/Color';
import {normalize} from '../../helper/FontSize';
import {useSelector} from 'react-redux';

const MovieOverview = ({hideView = false}) => {
  const movieDetail = useSelector(state => state.movie.detail);
  const selectedMovieDetailHome = useSelector(
    state => state.swimlane.selectedMovieDetailHome,
  );
  const movieData = selectedMovieDetailHome || {};
  const [expanded, setExpanded] = useState(false);
  const textLines = useState(new Animated.Value(expanded ? 5 : 2))[0];

  const toggleNumberOfLines = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
    Animated.timing(textLines, {
      toValue: expanded ? 2 : 5,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  if (hideView || !movieData.overview)
    return <View style={Styles.container} ></View>;
  if (selectedMovieDetailHome && selectedMovieDetailHome.mediaUuid)
    return (
      <View style={Styles.container}>
        <Text style={Styles.titleText}>Overview</Text>
          <View>
          <Animated.Text
            style={[
              Styles.textOverview,
              expanded ? {fontSize: normalize(1.2)} : null,
            ]}
            numberOfLines={textLines}>
            {movieData.overview}
          </Animated.Text>
          </View>
      </View>
    );
};

const Styles = {
  container: {
    marginLeft: '2%',
    width: '50%',
    paddingBottom: '1%',
    paddingTop: '.8%',
  },
  titleText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: normalize(1.8),
    marginBottom: 2,
    marginTop: 5,
    color: white,
  },
  textOverview: {
    fontFamily: 'Montserrat-Regular',
    fontSize: normalize(1),
    color: white,
    marginVertical: 5,
    flexWrap: 'wrap',
  },
};

export default React.memo(MovieOverview);
