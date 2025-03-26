import React, { useEffect, useState, useMemo } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import { blue, white, yellow } from '../helper/Color';
import BackIcon from '../component/Utils/BackIcon';
import MovieCastDetailTabScreen from './MovieCastDetailTabScreen';
import MovieCastBackdrop from '../component/MovieDetail/MovieCastBackdrop';
import { normalize } from '../helper/FontSize';
import { imgBGPrimaryColor, invertColor } from '../helper/Types';
import { getImageUrl } from '../api/url';
import Images from '../component/Utils/ImageComponent';
import { useDispatch, useSelector } from 'react-redux';
import { setroute } from '../../redux/reducers/routeName';
// import { Page } from '../TVComponents/components/Page';
import { DefaultFocus,SpatialNavigationFocusableView, SpatialNavigationScrollView, SpatialNavigationRoot } from 'react-tv-space-navigation';
import ScrollContainer from '../component/Home/scrollContainer';
import { Page } from '../../src1/components/Page';

const isWeb = Platform.isTV || Platform.OS === 'web';

const MovieCastDetail = ({ route, navigation }) => {
  const [moviesCast, setMoviesCast] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [count, setCount] = useState(false);
  const [bg_color, setBgColor] = useState('#111111');
  const [url, setUrl] = useState('');
  const [font_color, setFontColor] = useState('#ffffff');
  const [backdrop_path, setBackdropPath] = useState('');
  const [role, setRole] = useState('');
  const dispatch = useDispatch();

  const { name, imageUrl } = route.params;

  useEffect(() => {
    getMovieCastDetail();
    dispatch(setroute('Cast_details'))
  }, []);

  const getMovieCastDetail = async () => {
    try {
      const response = await fetch(
        'https://vt1qpaizsf.execute-api.us-west-2.amazonaws.com/OTTAppMediaInterface/getMoviesByCreditName?name=' +
        name,
      );
      const result = await response.json();
      setMoviesCast(result);
      setIsLoaded(true);
      setBackdropPath(result.creditMovies[0].backdrop_path);
      setRole(result.creditData.knownForDepartment);

      const urls = await getImageUrl(
        result[0]?.creditData?.profileImage,
        'uri',
        'original',
      );

      let urlbg = await imgBGPrimaryColor(urls);
      let fontColoir = invertColor(urlbg, true);

      setUrl(urls);
      // setBgColor(urlbg);
      // setFontColor(fontColoir);
    } catch (error) {
      console.error(error);
    }
  };

  if (Platform.OS==='web') {
    return(
      <Page>
       <DefaultFocus>
        {/* bg_color */}
       <ScrollView style={{flex: 1}}  offsetFromStart={170}>
         <MovieCastBackdrop backdrop={'Banner/Cast+Banner.PNG'}>
           <View>
             <Text style={Styles.CastRoleText}>{role}</Text>
           </View>
           <View>
             <Text style={Styles.CastNametext}>{name}</Text>
           </View>
           <SpatialNavigationFocusableView
            //  isFocusable
           // onFocus={() => _onTabPress(item)}
           // onPress={() => _onTabPress(item)}
           >
             {({ isFocused }) => (
               <View style={Styles.imageContainer}>
                 <Images
                   source={imageUrl}
                   style={[Styles.imageSize, { borderWidth: 2, borderColor: isFocused ? 'white' : 'transparent' }]}
                   color={bg_color}
                 />
               </View>
             )}</SpatialNavigationFocusableView>
         </MovieCastBackdrop>
         {/* <View style={{flex: 1}}> */}
           {isLoaded && (
             <View style={{ marginBottom: 15 }}>
               <View style={Styles.biographyContainer}>
                 <TouchableWithoutFeedback onPress={() => setCount(!count)}>
                   <Text
                     numberOfLines={count ? 0 : isWeb ? 4 : 8}
                     style={[Styles.castBiographyText, { color: font_color }]}>
                     {moviesCast.creditData.biography}
                   </Text>
                 </TouchableWithoutFeedback>
               </View>

               <View>
                 <Text
                   style={[Styles.castPersonalDataText, { color: font_color }]}>
                   Personal Data :
                 </Text>
               </View>
               <View style={Styles.personalDataContainer}>
                 {moviesCast.creditData.birthPlace != null && (
                   <Text
                     style={[Styles.castDetailtextLeft, { color: font_color }]}>
                     {'Birthplace :             '}
                     <Text
                       style={[Styles.castDetailtextRight, { color: font_color }]}>
                       {moviesCast.creditData.birthPlace}
                     </Text>
                   </Text>
                 )}
                 {moviesCast.creditData.birthday != null && (
                   <Text
                     style={[Styles.castDetailtextLeft, { color: font_color }]}>
                     {'Birthday :                '}
                     <Text
                       style={[Styles.castDetailtextRight, { color: font_color }]}>
                       {moviesCast.creditData.birthday}
                     </Text>
                   </Text>
                 )}
                 {moviesCast.creditData.country != null && (
                   <Text
                     style={[Styles.castDetailtextLeft, { color: font_color }]}>
                     {'Country :                 '}
                     <Text
                       style={[Styles.castDetailtextRight, { color: font_color }]}>
                       {moviesCast.creditData.country}
                     </Text>
                   </Text>
                 )}
                 {moviesCast.creditData.deathday != null && (
                   <Text
                     style={[Styles.castDetailtextLeft, { color: font_color }]}>
                     {'Deathday :               '}
                     <Text
                       style={[Styles.castDetailtextRight, { color: font_color }]}>
                       {moviesCast.creditData.deathday}
                     </Text>
                   </Text>
                 )}
               </View>
             </View>
           )}
         {/* </View> */}
         <View style={{ backgroundColor: bg_color }}>
           {moviesCast ? (
             <MovieCastDetailTabScreen
               Castdata={moviesCast}
               bg_color={bg_color}
             />
           ) : null}
         </View>
       </ScrollView>
     </DefaultFocus>
    </Page>
    )
  }

  return (
    <Page>
      {(Platform.isTV) ? 
       <DefaultFocus>
        {/* bg_color */}
       {/* <ScrollView style={{flex: 1}}  offsetFromStart={170}> */}
        <SpatialNavigationScrollView style={{flex: 1}}  offsetFromStart={Platform.OS==='android'? 140:110}>
       
         {/* <View style={{flex: 1}}> */}
       
         <MovieCastBackdrop backdrop={'Banner/Cast+Banner.PNG'}>
         <BackIcon
              navigation={navigation}
              style={[Styles.backContainer,{top:Platform.OS==='android'?50:-50,left:40}]}
              touchStyle={Styles.touchStyle}
              color={'white'}
            />
           <View>
             <Text style={Styles.CastRoleText}>{role}</Text>
           </View>
           <View>
             <Text style={Styles.CastNametext}>{name}</Text>
           </View>
           <SpatialNavigationFocusableView
            //  isFocusable
           // onFocus={() => _onTabPress(item)}
           // onPress={() => _onTabPress(item)}
           >
             {({ isFocused }) => (
               <View style={[Styles.imageContainer]}>
                 <Images
                   source={imageUrl}
                   style={[Styles.imageSize, { borderWidth: 2, borderColor: isFocused ? 'white' : 'transparent' }]}
                   color={bg_color}
                 />
               </View>
             )}</SpatialNavigationFocusableView>
         </MovieCastBackdrop>
         {/* <View style={{flex: 1}}> */}
           {isLoaded && (
             <View style={{ marginBottom: 15 }}>
               <View style={Styles.biographyContainer}>
                 <TouchableWithoutFeedback onPress={() => setCount(!count)}>
                   <Text
                     numberOfLines={count ? 0 : isWeb ? 4 : 8}
                     style={[Styles.castBiographyText, { color: font_color }]}>
                     {moviesCast.creditData.biography}
                   </Text>
                 </TouchableWithoutFeedback>
               </View>

               <View>
                 <Text
                   style={[Styles.castPersonalDataText, { color: font_color }]}>
                   Personal Data :
                 </Text>
               </View>
               <View style={Styles.personalDataContainer}>
                 {moviesCast.creditData.birthPlace != null && (
                   <Text
                     style={[Styles.castDetailtextLeft, { color: font_color }]}>
                     {'Birthplace :             '}
                     <Text
                       style={[Styles.castDetailtextRight, { color: font_color }]}>
                       {moviesCast.creditData.birthPlace}
                     </Text>
                   </Text>
                 )}
                 {moviesCast.creditData.birthday != null && (
                   <Text
                     style={[Styles.castDetailtextLeft, { color: font_color }]}>
                     {'Birthday :                '}
                     <Text
                       style={[Styles.castDetailtextRight, { color: font_color }]}>
                       {moviesCast.creditData.birthday}
                     </Text>
                   </Text>
                 )}
                 {moviesCast.creditData.country != null && (
                   <Text
                     style={[Styles.castDetailtextLeft, { color: font_color }]}>
                     {'Country :                 '}
                     <Text
                       style={[Styles.castDetailtextRight, { color: font_color }]}>
                       {moviesCast.creditData.country}
                     </Text>
                   </Text>
                 )}
                 {moviesCast.creditData.deathday != null && (
                   <Text
                     style={[Styles.castDetailtextLeft, { color: font_color }]}>
                     {'Deathday :               '}
                     <Text
                       style={[Styles.castDetailtextRight, { color: font_color }]}>
                       {moviesCast.creditData.deathday}
                     </Text>
                   </Text>
                 )}
               </View>
             </View>
           )}
         {/* </View> */}
         <View style={{ backgroundColor: bg_color , marginBottom:Platform.OS==='android'?0:140}}>
           {moviesCast ? (
             <MovieCastDetailTabScreen
               Castdata={moviesCast}
               bg_color={bg_color}
             />
           ) : null}
         </View>
         </SpatialNavigationScrollView>
         {/* </View> */}
       {/* </ScrollView> */}
     </DefaultFocus>:
          <ScrollView style={{flex: 1,backgroundColor: bg_color}}>
            <BackIcon
              navigation={navigation}
              style={Styles.backContainer}
              touchStyle={Styles.touchStyle}
              color={'white'}
            />
          <MovieCastBackdrop backdrop={'Banner/Cast+Banner.PNG'}>
            <View>
              <Text style={Styles.CastRoleText}>{role}</Text>
            </View>
            <View>
              <Text style={Styles.CastNametext}>{name}</Text>
            </View>
          
                <View style={Styles.imageContainer}>
                  <Images
                    source={imageUrl}
                    style={[Styles.imageSize, { borderWidth: 2, borderColor:'transparent' }]}
                    color={bg_color}
                  />
                </View>
          </MovieCastBackdrop>
          <View style={Styles.wrapper}>
            {isLoaded && (
              <View style={{ marginBottom: 15 }}>
                <View style={Styles.biographyContainer}>
                  <TouchableWithoutFeedback onPress={() => setCount(!count)}>
                    <Text
                      numberOfLines={count ? 0 :8}
                      style={[Styles.castBiographyText, { color: font_color }]}>
                      {moviesCast.creditData.biography}
                    </Text>
                  </TouchableWithoutFeedback>
                </View>

                <View>
                  <Text
                    style={[Styles.castPersonalDataText, { color: font_color }]}>
                    Personal Data :
                  </Text>
                </View>
                <View style={Styles.personalDataContainer}>
                  {moviesCast.creditData.birthPlace != null && (
                    <Text
                      style={[Styles.castDetailtextLeft, { color: font_color }]}>
                      {'Birthplace :             '}
                      <Text
                        style={[Styles.castDetailtextRight, { color: font_color }]}>
                        {moviesCast.creditData.birthPlace}
                      </Text>
                    </Text>
                  )}
                  {moviesCast.creditData.birthday != null && (
                    <Text
                      style={[Styles.castDetailtextLeft, { color: font_color }]}>
                      {'Birthday :                '}
                      <Text
                        style={[Styles.castDetailtextRight, { color: font_color }]}>
                        {moviesCast.creditData.birthday}
                      </Text>
                    </Text>
                  )}
                  {moviesCast.creditData.country != null && (
                    <Text
                      style={[Styles.castDetailtextLeft, { color: font_color }]}>
                      {'Country :                 '}
                      <Text
                        style={[Styles.castDetailtextRight, { color: font_color }]}>
                        {moviesCast.creditData.country}
                      </Text>
                    </Text>
                  )}
                  {moviesCast.creditData.deathday != null && (
                    <Text
                      style={[Styles.castDetailtextLeft, { color: font_color }]}>
                      {'Deathday :               '}
                      <Text
                        style={[Styles.castDetailtextRight, { color: font_color }]}>
                        {moviesCast.creditData.deathday}
                      </Text>
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
          <View style={{ backgroundColor: bg_color,marginTop:30 }}>
            {moviesCast ? (
              <MovieCastDetailTabScreen
                Castdata={moviesCast}
                bg_color={bg_color}
              />
            ) : null}
          </View>
          </ScrollView>
     
      }
     
    </Page>
  );
};

export default MovieCastDetail;

const Styles = StyleSheet.create({
  CastRoleText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: isWeb ? normalize(1.6) : normalize(2.4),
    marginTop: isWeb ? 90 : -20,
    marginRight: 0,
    marginBottom: isWeb ? 0 : 0,
    marginLeft: isWeb
      ? Dimensions.get('window').width / 3.48
      : Dimensions.get('window').width / 23,
    color: yellow,
  },
  CastNametext: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: 'bold',
    fontSize: isWeb ? normalize(3.4) : normalize(4), //isWeb ? 36 : 26,
    marginBottom: isWeb ? 90 : 60,
    marginTop: isWeb ? 0 : 0,
    marginRight: 0,
    marginLeft: isWeb
      ? Dimensions.get('window').width / 3.5
      : Dimensions.get('window').width / 26.8,
    color: white,
  },
  castBiographyText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: isWeb ? normalize(1.3) : normalize(2), //isWeb ? 20 : 18,
    marginBottom: 0,
    marginTop: isWeb ? 20 : 17,
    marginRight: isWeb ? 260 : 20,
    marginLeft: isWeb
      ? Dimensions.get('window').width / 3.5
      : Dimensions.get('window').width / 2,
    color: white,
  },
  castPersonalDataText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: isWeb ? normalize(1.4) : normalize(2), //isWeb ? 20 : 18,
    marginTop: isWeb ? 10 : 22,
    marginLeft: isWeb
      ? Dimensions.get('window').width / 3.5
      : Dimensions.get('window').width / 23.6,
    color: white,
    paddingVertical: 7,
    opacity: 0.6,
  },
  castDetailtextLeft: {
    fontFamily: 'Montserrat-Regular',
    fontSize: isWeb ? normalize(1.2) : normalize(2), //isWeb ? 20 : 18,
    fontWeight: 'bold',
    marginTop: 0,
    marginRight: 0,
    marginLeft: isWeb
      ? Dimensions.get('window').width / 3.5
      : Dimensions.get('window').width / 23.6,
    color: white,
    paddingVertical: 1.2,
  },
  castDetailtextRight: {
    fontFamily: 'Montserrat-Regular',
    fontSize: isWeb ? normalize(1.2) : normalize(2), //isWeb ? 20 : 18,
    fontWeight: isWeb ? 'normal' : 'normal',
    marginTop: 0,
    marginRight: 0,
    marginLeft: isWeb
      ? Dimensions.get('window').width / 1000
      : Dimensions.get('window').width / 23.6,
    color: white,
    paddingVertical: 1.2,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 0,
    marginTop: 0,
    marginRight: 0,
    marginLeft: 0,
  },
  imageContainer: {
    position: 'absolute',
    left: isWeb ? normalize(11) : normalize(2.5),
    top: isWeb ? Platform.OS==='ios'? -130:-30 : 80,
    // bottom: isWeb ? 0 : 50,
  },
  imageSize: {
    height: isWeb ? normalize(21) : normalize(25), //isWeb ? 250 : 210,
    width: isWeb ? normalize(15) : normalize(19), //isWeb ? 200 : 160,
    borderWidth: isWeb ? 1 : 0.3,
    borderColor: 'gray',
  },
  movieDetailWrapper: {
    flex: 1,
  },
  movieDetail: {
    flex: 1,
    padding: 30,
    paddingTop: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  readMoreText: {
    fontFamily: 'Montserrat',
    fontSize: 20,
    color: blue,
    paddingHorizontal: 15,
  },
  backContainer: {
    height: 50,
    width: 50,
    borderRadius: 50,
    position: 'absolute',
    top: 30,
    left: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backgroundColor: 'gray'
  },
  touchStyle: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


// const Styles = StyleSheet.create({
//   CastRoleText: {
//     fontFamily: 'Montserrat-Bold',
//     fontSize: normalize(2.4),
//     marginTop: -20,
//     marginLeft: Dimensions.get('window').width / 23,
//     color: 'yellow',
//   },
//   CastNametext: {
//     fontFamily: 'Montserrat-Regular',
//     fontWeight: 'bold',
//     fontSize: normalize(5.5),
//     marginBottom: 60,
//     marginLeft: Dimensions.get('window').width / 26.8,
//     color: 'white',
//   },
//   castBiographyText: {
//     fontFamily: 'Montserrat-Regular',
//     fontSize: normalize(2.4),
//     // marginTop: 17,
//     marginRight: 20,
//     marginLeft: Dimensions.get('window').width / 2.6,
//     color: 'white',
//   },
//   castPersonalDataText: {
//     fontFamily: 'Montserrat-Regular',
//     fontSize: normalize(2.2),
//     marginTop: 22,
//     marginLeft: Dimensions.get('window').width / 23.6,
//     color: 'white',
//     paddingVertical: 7,
//     opacity: 0.6,
//   },
//   castDetailtextLeft: {
//     fontFamily: 'Montserrat-Regular',
//     fontSize: normalize(2.2),
//     fontWeight: 'bold',
//     marginLeft: Dimensions.get('window').width / 23.6,
//     color: 'white',
//     paddingVertical: 1.2,
//   },
//   castDetailtextRight: {
//     fontFamily: 'Montserrat-Regular',
//     fontSize: normalize(2.2),
//     fontWeight: 'normal',
//     marginLeft: Dimensions.get('window').width / 23.6,
//     color: 'white',
//     paddingVertical: 1.2,
//   },
//   imageContainer: {
//     position: 'absolute',
//     left: normalize(2.2),
//     top: 90,
//   },
//   imageSize: {
//     height: normalize(25),
//     width: normalize(19),
//     borderWidth: 0.3,
//     borderColor: 'gray',
//   },
//   backContainer: {
//     height: 50,
//     width: 50,
//     borderRadius: 50,
//     position: 'absolute',
//     top: 40,
//     left: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 9999,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//   },
//   touchStyle: {
//     height: 50,
//     width: 50,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   wrapper: {
//     padding: 20,
//   },
//   biographyContainer: {
//     marginBottom: 20,
//   },
//   personalDataContainer: {
//     marginBottom: 20,
//   },
// });