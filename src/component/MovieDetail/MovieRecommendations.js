import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {View, Text, FlatList, StyleSheet, Platform} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {white} from '../../helper/Color';
import Images from '../Utils/ImageComponent';
import {FocusButton} from 'react-native-tv-selected-focus/src';
import {useSelector} from 'react-redux';
import {getImageUrl} from '../../api/url';
import {normalize} from '../../helper/FontSize';
import MoviePoster from '../MoviePoster';
import CreateResponsiveStyle from '../../helper/responsiveStyle';
import { Box } from '../../TVComponents/design-system/components/Box';
import { ProgramListWithTitle } from '../../../src1/modules/program/view/ProgramListWithTitle';
// import { ProgramListWithTitle } from '../../TVComponents/modules/program/view/ProgramListWithTitle';
const isWider=Platform.isTV || Platform.OS==='web';
const MovieRecommendations = ({color, focusOn, onFocus}) => {
  const fontColor = color || white;
  const navigation = useNavigation();
  // const movieDetail = useSelector(state => state.movie.detail);
  const routeId = useRoute();
  const {id} = routeId.params;
  const {movieDetailData} = useSelector(state => state.movie);
  let movieDetail = movieDetailData.find(data => data.movieData.id === id);

  const recommendations = movieDetail?.recommendations;
  const movieData = recommendations?.results;
  const [elementOuterWidth, setElementOuterWidth] = useState(0);
  const flatListRef = useRef(null);

  const route = useRoute().name;

  if (!movieData.length) {
    return null;
  }

  const scrollToIndex = index => {
    flatListRef.current.scrollToIndex({animated: true, index});
    onFocus(movieData[index].id);
  };

  const renderItem = ({item, index}) => {
    if (Platform.isTV || Platform.OS === 'web') {
      return (
        <Recommendations
          item={item}
          navigation={navigation}
          route={route}
          fontColor={fontColor}
          index={index}
          scrollToIndex={scrollToIndex}
          focusOn={focusOn}
        />
      );
    } else {
      return <MoviePoster item={item} navigation={navigation} />;
    }
  };

  const onLayoutOuter = event => {
    const {width} = event.nativeEvent.layout;
    setElementOuterWidth(width);
  };

  if(isWider){
    // console.log('movieData---',movieData.length)
    return movieData.length>0?(
      <Box padding="$5">
      <ProgramListWithTitle title={'Recommendations'} data={movieData} />
      {/* <Spacer gap="$6" /> */}
   </Box>
    ):null
  }

  return (
    <View style={Styles.container} onLayout={onLayoutOuter}>
      <Text style={[style.titleText, {color: fontColor}]}>
        Recommendations
      </Text>
        <FlatList
          keyExtractor={item => item.id.toString()}
          data={movieData}
          style={style.flatList}
          contentContainerStyle={Styles.contentContainer}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={() => (
            <View
              style={{
                width:10,
              }}></View>
          )}
        />
    </View>
  );
};

const Recommendations = React.memo(
  ({item, navigation, route, fontColor, index, scrollToIndex, focusOn}) => {
    const movieDetail = useSelector(state => state.movie.detail);
    const recommendations= movieDetail?.recommendations;
    const movieData = recommendations.results;
    const imageUrl = getImageUrl(item.poster_path, 'uri', 'w185');
    return (
      <FocusButton
        tvParallaxProperties={{
          enabled: true,
          shiftDistanceX: 1.5,
          shiftDistanceY: 1.5,
          tiltAngle: 0.01,
          magnification: 1.13,
        }}
        underlayColor="transparent"
        style={{paddingHorizontal: 5}}
        blockFocusRight={index === movieData?.length - 1}
        blockFocusLeft={index === 0}
        onPress={() => navigation.push(route, {id: item.id})}
        onFocus={() => scrollToIndex(index)} // Scroll to the item's index when focused
      >
        <View style={style.itemContainer}>
          <Images
            source={imageUrl}
            style={[
              style.image,
              focusOn === item.id
                ? {borderColor: 'white', borderWidth: 2}
                : null,
            ]}
          />
          <Text
            style={[Styles.bottomText, {color: fontColor}]}
            numberOfLines={1}>
            {item.title}
          </Text>
        </View>
      </FocusButton>
    );
  },
);

MovieRecommendations.propTypes = {
  navigation: PropTypes.object,
  color: PropTypes.string,
};

const Styles = StyleSheet.create({
  container: {
    PaddingTop: 12,
  },
 
  contentContainer: {
    paddingBottom: 10,
  },
  bottomText: {
    width: normalize(17),
    fontFamily: 'Montserrat-Regular',
    fontSize: normalize(1.3),
    marginTop: 4,
  },
});

const style = CreateResponsiveStyle(
  //web
  {
    itemContainer: {
      marginHorizontal: 5,
    },
    image: {
      borderRadius: 10,
      height: normalize(22),
      width: normalize(17),
      margin:  6,
    },
    titleText: {
      fontFamily: 'Montserrat-Bold',
      fontSize: normalize(1.6),
      marginBottom: 4,
      marginTop: 24,
      paddingHorizontal: 10,
    },
    flatList: {
      paddingVertical: 30,
      paddingHorizontal: 5,
    },
  },
  // tv
  {
    itemContainer: {
      marginHorizontal: 5,
      paddingHorizontal: 10,
    },
    image: {
      borderRadius: 10,
      height: normalize(22),
      width: normalize(17),
    },
    titleText: {
      fontFamily: 'Montserrat-Bold',
      fontSize: normalize(1.6),
      marginBottom: 4,
      marginTop: 24,
      paddingHorizontal: 10,
    },
    flatList: {
      paddingVertical: 30,
      paddingHorizontal: 5,
    },
  },
  // mobile
  {
    itemContainer: {
      marginHorizontal: 5,
    },
    image: {
      borderRadius: 10,
      height: normalize(22),
      width: normalize(17),
    },
    titleText: {
      fontFamily: 'Montserrat-Bold',
      fontSize: normalize(1.6),
      marginBottom:0,
      marginTop: 24,
      paddingHorizontal: 10,
    },
    flatList: {
      paddingVertical: 5,
      paddingHorizontal: 5,
    },
  },
);

export default MovieRecommendations;
