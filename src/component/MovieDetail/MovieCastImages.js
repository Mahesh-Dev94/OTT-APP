import React from 'react';
import {View, Text, FlatList, Dimensions, Image,TouchableOpacity,StyleSheet, Platform} from 'react-native';
import {getImageUrl} from '../../api/url';
//import {Styles} from './Styles';
import { blue, gray, white, yellow } from "../../helper/Color";
import PropTypes from 'prop-types';
import { normalize } from '../../helper/FontSize';
import Images from '../Utils/ImageComponent';
import { SpatialNavigationFocusableView } from 'react-tv-space-navigation';
const {width} = Dimensions.get('window');
const MovieCastImages = (images) => {
  
  const imageUrl = getImageUrl(images.images, 'uri', 'w185');
  console.log(imageUrl,'---images---',images)
   if(Platform.isTV || Platform.OS==='web'){
    return(
      <SpatialNavigationFocusableView  isFocusable={true}>
  {({ isFocused }) => <View>
      {imageUrl?<Images source={imageUrl} style={[Styles.imageSize,{borderWidth:2,borderColor:isFocused?'white':'transparent'}]}/>:null}
       </View>}
    </SpatialNavigationFocusableView>
    )
   }

  return (
    <View>
   {imageUrl?<Images source={imageUrl} style={Styles.imageSize}/>:null}
    </View>
  );
};
    
const Styles = StyleSheet.create({
CastNametext: {
  fontFamily: "Montserrat-Bold",
  fontSize: 32,
  marginBottom: 0,
  marginTop: 150,
  marginRight: 10,
  marginLeft: 0,
  color: white
},
imageSize : {
  // height: normalize(19),
  // width: normalize(14),
  height:(Platform.isTV || Platform.OS==='web')?normalize(19) : 240,
  width:(Platform.isTV || Platform.OS==='web')?normalize(14):(width/2)-30,
  marginRight: 0,
  margin: 15,
  borderRadius: 10
  },
});

export default MovieCastImages;

MovieCastImages.propTypes = {
  images: PropTypes.string,
};