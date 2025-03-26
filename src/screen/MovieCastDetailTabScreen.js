import * as React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import MovieCastImages from '../component/MovieDetail/MovieCastImages';
import {gray, white} from '../helper/Color';
import {normalize} from '../helper/FontSize';
import MoviePoster from '../component/Home/HomeMoviePoster';
import MobMoviePoster from '../component/MoviePoster';
import {useNavigation} from '@react-navigation/native';
import {
  DefaultFocus,
  SpatialNavigationFocusableView,
  SpatialNavigationScrollView,
  SpatialNavigationView,
} from 'react-tv-space-navigation';
import { Box } from '../../src1/design-system/components/Box';
import { ProgramsRow } from '../../src1/modules/program/view/ProgramList';
import { autoBatchEnhancer } from '@reduxjs/toolkit';
// import { Box } from '../TVComponents/design-system/components/Box';
// import { ProgramListWithTitle } from '../TVComponents/modules/program/view/ProgramListWithTitle';
// import { ProgramsRow } from '../TVComponents/modules/program/view/ProgramList';
const {width} = Dimensions.get('window');

const isWeb = Platform.isTV || Platform.OS === 'web';
const MovieCastDetailTabScreen = (Castdata, bg_color) => {
  const navigation = useNavigation();
  const [images, setImages] = React.useState([]);

  React.useEffect(() => {
    console.log('bg_color----',bg_color)
    if (Castdata.Castdata.creditData) {
      setImages(Castdata.Castdata.creditData.personImages);
    }
  }, [Castdata]);

  const [routes] = React.useState([
    {key: 'movies', title: 'Movies'},
    {key: 'photos', title: 'Photos'},
    {key: 'videos', title: 'Videos'},
  ]);

  const [selected, setSelected] = React.useState(routes[0].key);

  const Movies = movies => {
    if(Platform.isTV || Platform.OS==='web'){
     return( <Box Box padding="$1">
      <ProgramsRow title={'Recommendations'}  data={movies}/>
   </Box>)
    }
    return (
      <View style={{padding: 0}}>
        <FlatList
          data={movies}
          horizontal
          renderItem={({item}) =>
            Platform.isTV || Platform.OS === 'web' ? (
              <MoviePoster
                item={item}
                navigation={navigation}
                type={'movie'}
                call_from={'Cast'}
                onMovieFocus={() => console.log('item')}
              />
            ) : (
              <MobMoviePoster
                item={item}
                navigation={navigation}
                type={'movie'}
                call_from={'Cast'}
                height={240}
                 width={(width/2)-30}
              />
            )
          }
          keyExtractor={item => item.id.toString()}
          style={{marginTop: 4}}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  const Photos = Images => {
    if(Platform.isTV || Platform.OS==='web'){
      return (
        <SpatialNavigationScrollView  horizontal={true} style={{ paddingBottom: 0,height:Platform.OS==='ios'? normalize(20):'auto'}} offsetFromStart={10}>
        {Images.map((item,index)=><MovieCastImages key={index.toString()} images={item} /> )}
        </SpatialNavigationScrollView>
      )
    }
    return (
      <View style={{backgroundColor: 'dark'}}>
        <FlatList
          data={Images}
          horizontal
          renderItem={({item,index}) => {
            return item ? <MovieCastImages key={index.toString()} images={item} /> : <View></View>;
          }}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  const Videos = soo => (
    <View style={{backgroundColor: 'dark', alignItems: 'center',justifyContent:'center',alignSelf:'center',marginTop:10}}>
      <Text style={Styles.VideoText}>No Data Available</Text>
    </View>
  );

  const renderScene = route => {
    switch (route) {
      case 'movies':
        return Movies(Castdata.Castdata.creditMovies);
      case 'photos':
        return Photos(images);
      case 'videos':
        return <Videos foo={Castdata.Castdata} />;
      default:
        return null;
    }
  };

  const _onTabPress = val => {
    setSelected(val.key);
  };

  // const hexToRgb = hex => {
  //   var bigint = parseInt(hex, 16);
  //   var r = (bigint >> 16) & 255;
  //   var g = (bigint >> 8) & 255;
  //   var b = bigint & 255;
  //   return r + ',' + g + ',' + b;
  // };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:bg_color // 'rgba(' + hexToRgb(bg_color) + ',' + '0.2)',
      }}>
      {isWeb ? (
        <SpatialNavigationView
          direction={'horizontal'}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: bg_color,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            paddingTop: isWeb ? 30 : 20,
          }}>
          {routes.map((item, index) => {
              return (
                <SpatialNavigationFocusableView
                key={item.key}
                  isFocusable
                  onFocus={() => _onTabPress(item)}
                  onPress={() => _onTabPress(item)}>
                  {({isFocused}) => (
                    <View
                      style={[
                        Styles.tabText,
                        Styles.activeTab,
                        {
                          backgroundColor: (selected === item.key)  ? white : 'gray',
                        },
                      ]}>
                      <Text style={{color: (selected === item.key) ? 'black' : white,fontSize:isFocused?18:16}}>
                        {item.title}
                      </Text>
                    </View>
                  )}
                </SpatialNavigationFocusableView>
              );
          })}
        </SpatialNavigationView>
      ) : (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            // paddingHorizontal: 20,
            // paddingVertical: 10,
            backgroundColor:'gray',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            // paddingTop: isWeb ? 30 : 20,
          }}>
          {routes.map((item, index) => {
            return (
              <TouchableHighlight
                key={item.key}
                tvParallaxProperties={{
                  enabled: true,
                  shiftDistanceX: 1.9,
                  shiftDistanceY: 1.9,
                  tiltAngle: 0.05,
                  magnification: 1.15,
                }}
                onFocus={() => _onTabPress(item)}
                onPress={() => _onTabPress(item)}
                underlayColor={'transparent'}>
                   <View
                      style={[
                        Styles.tabText,
                        Styles.activeTab,
                        {height:55},
                        {
                          backgroundColor: (selected === item.key)  ? white : 'gray',
                        },
                      ]}>
                <Text
                  style={{color: (selected === item.key) ? 'black' : white,fontSize:selected === item.key?18:16}}>
                  {item.title}
                </Text>
                </View>
              </TouchableHighlight>
            );
          })}
        </View>
      )}

     {isWeb? <SpatialNavigationView direction='horizontal' style={{height:300}}>{renderScene(selected)}</SpatialNavigationView>:
     <View style={{height:300}}>{renderScene(selected)}</View>}
    </View>
  );
};

const Styles = StyleSheet.create({
  tabText: {
    textAlign: 'center',
    fontSize: isWeb ? normalize(1.8) : normalize(2.4),
    width: (width - 40) / 3,
    fontFamily: 'Montserrat-Medium',
    color: gray,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  activeTab: {
    fontFamily: 'Montserrat-Medium',
    fontSize: isWeb ? normalize(2.2) : normalize(2.8),
    paddingVertical: isWeb ? 10 : 5,
    paddingHorizontal: isWeb ? 10 : 2,
    paddingTop: isWeb ? 13 : 8,
    paddingBottom: isWeb ? 13 : 8,
    // borderRadius: 5,
    // borderWidth: 1,
    // borderColor: gray,
  },
  VideoText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: normalize(1.8),
    textAlign:'center',
    alignSelf:'center',
    justifyContent:'flex-start',
    paddingLeft:40,
    color: gray,
  },
});

MovieCastDetailTabScreen.propTypes = {
  Castdata: PropTypes.object,
  navigation: PropTypes.any,
  bg_color: PropTypes.any,
};

export default React.memo(MovieCastDetailTabScreen);
