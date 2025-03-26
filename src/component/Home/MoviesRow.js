import React, {memo} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Dimensions
} from 'react-native';
import {normalize} from '../../helper/FontSize';
import {orange, lightGray} from '../../helper/Color';
import ScrollContainer from './scrollContainer';
import MobMoviePoster from '../MoviePoster';
const screen = Dimensions.get('window');
const MoviesRow = memo(({ homePageDetails }) => {
  const renderSwimlane = ({ item }) => (<MobMoviePoster
      isLive={item.mediaUuid ? false : true}
      call_from={'Home'}
      height={240} 
      width={(screen.width/2)-30}
      item={item}
    /> );

  return (
    <ScrollContainer>
      {homePageDetails.map((item, index) => (
         <View key={index} style={{flexDirection:'column'}}>
           <Text
             style={Styles.text}>
             {item.title}
           </Text>
        <FlatList
          data={item.data}
          style={Styles.flatList}
          renderItem={renderSwimlane}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={() => <View style={Styles.footer} />}
        />
        </View>
      ))}
    </ScrollContainer>
  );
});

export default MoviesRow;

const Styles = StyleSheet.create({
  text: {
    marginHorizontal: 10,
    marginTop: 5,
    fontFamily: 'Montserrat-SemiBold',
    color: lightGray,
    fontSize: 18
  },

  textMore: {
    margin: 16,
    marginBottom: 0,
    fontFamily: 'Montserrat-SemiBold',
    alignSelf: 'flex-end',
    color: orange,
    fontSize: normalize(1.5),
  }, 
  flatList: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
});
