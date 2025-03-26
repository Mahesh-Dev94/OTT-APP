import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {getImageUrl} from '../../api/url';
import {Styles} from './Styles';
import { normalize } from "../../helper/FontSize";
import Images from "../Utils/ImageComponent";

const MovieSeason = ({seasonData, navigation, movieid}) => {
  const seasons =
    seasonData[0].season_number < 1
      ? [...seasonData.slice(1), seasonData[0]]
      : seasonData;
  const seasonName = seasonData.map(item => item.name);

  return (
    <View>
      <Text style={Styles.titleText}>Seasons</Text>
      <FlatList
        keyExtractor={item => item.id.toString()}
        data={seasons}
        renderItem={({item}) =>
          SeasonItem(item, navigation, seasonName, movieid)
        }
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const SeasonItem = (data, navigation, seasonName, movieid) => {
  const imageUrl = getImageUrl(data.poster_path, 'uri', 'w185');
  return (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate('Movieseason', {
          season: data,
          listSeason: seasonName,
          movieid: movieid,
        })
      }>
      <View>
        <View
          style={[
            Styles.imagePlaceholder,
            {height: 180, width: 120, marginRight: 8, borderRadius: 10},
          ]}>
          <Images
            source={imageUrl}
            style={{height: 180, width: 120, marginRight: 8, borderRadius: 10}}
          />
        </View>
        <Text
          style={{
            fontFamily: 'Montserrat-SemiBold',
            fontSize: normalize(1),
            marginTop: 4,
            width: 100,
          }}>
          {data.name}
        </Text>
        <Text
          style={{
            fontFamily: 'Montserrat-Light',
            width: 100,
            fontSize: normalize(1),
          }}>{`${data.episode_count} episodes`}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MovieSeason;

MovieSeason.propTypes = {
  seasonData: PropTypes.array,
  navigation: PropTypes.object,
  movieid: PropTypes.number,
};
