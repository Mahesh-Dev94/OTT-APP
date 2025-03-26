import {StyleSheet, Dimensions, Platform} from 'react-native';
import {black, gray, white} from '../../helper/Color';
import {normalize} from '../../helper/FontSize';

const isWiderView = Platform.isTV || Platform.OS === 'web';
export const Styles = StyleSheet.create({
  titleText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: normalize(1.6),
    marginBottom: 4,
    marginTop: 24,
    color: white,
  },

  textOverview: {
    fontFamily: 'Montserrat-Regular',
    color: gray,
    fontSize: isWiderView ? normalize(1) : normalize(1.5),
    flexWrap: 'wrap',
    width: normalize(45),
    marginTop: 10,
    paddingLeft: 10,
  },

  imagePlaceholder: {
    backgroundColor: gray,
  },

  movieImages: {
    height: 120,
    marginRight: 8,
    borderRadius: 10,
    // marginHorizontal:10
  },

  card: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    shadowOpacity: 0.26,
    elevation: 8,
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 6,
    justifyContent: 'space-between', //Centered vertically
    alignItems: 'space-between', // Centered horizontally
    marginRight: 15,
    height: 228,
    width: 115,
    marginBottom: 5,
  },
});
