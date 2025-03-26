import React, { useCallback, useState } from 'react';
import {  Platform, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MovieTitle from '../MovieTitleDetails';
import MovieOverview from '../MovieOverviewNew';
import MovieDirector from '../MovieDirectorDetails';
import MovieButtons from '../MovieButtons';
import MovieCast from '../MovieCast';
import MovieRecommendations from '../MovieRecommendations';


const InfoDetailView = React.memo(({ font_color,onAlert }) => {
  const navigation = useNavigation();
  const [hasFocus, setHasFocus] = useState('')
  const navigateToMovie = useCallback(
    movieId => {
      navigation.navigate('MovieDetail', { id: movieId });
    },
    [navigation],
  );

  return (
    <View style={{ marginTop: 2 }}>
      <MovieTitle font_color={font_color} />
      <MovieOverview font_color={font_color} />
      <MovieDirector font_color={font_color} />
      <MovieButtons
        color={font_color}
        focusOn={hasFocus}
        onFocus={(focus) => setHasFocus(focus)}
        onAlert={()=>onAlert()}
        navigateToMovie={navigateToMovie} />
      <MovieCast color={font_color}
        focusOn={hasFocus}
        onFocus={(focus) => setHasFocus(focus)}
        navigation={navigation} />
      <MovieRecommendations
        color={font_color}
        focusOn={hasFocus}
        onFocus={(focus) => setHasFocus(focus)}
      />


       
    </View>
  );
});

export default InfoDetailView;
