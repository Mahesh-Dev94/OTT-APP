import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import {Pagination} from 'react-native-snap-carousel';
import MovieTitle from './HomeMovieTitle';
import MoviePlayButton from './HomeMoviePlayButton';
import Images from '../Utils/ImageComponent';
import {black, transparent} from '../../helper/Color';
import {requestGetLatest} from '../../api/api';
import {getImageUrl} from '../../api/url';

const width = Dimensions.get('window').width;

function CarouselMob() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselData, setcarouselData] = useState([]);
  const navigation = useNavigation();
  const fetchCarouselData = async () => {
    try {
      const result = await requestGetLatest();
      setcarouselData(result.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchCarouselData();
  }, []);

  return (
    <>
      <Carousel
        loop
        sliderWidth={width}
        itemWidth={width}
        sliderHeight={width / 1.5}
        height={width / 1.5}
        autoplay
        data={carouselData}
        enableSnap={true}
        enableMomentum={true}
        onSnapToItem={id => setActiveIndex(id)}
        renderItem={({item}) => {
          const img = getImageUrl(item.backdrop_path, 'uri', 'original');
          return (
            <TouchableHighlight
              onPress={() => {
                navigation.navigate('MovieDetail', {id: item.id});
              }}
              opacity={0}
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <Images source={img} style={styles.imageSize} />
                <View style={styles.detailContainer}>
                  <MovieTitle carouselData={item} />
                  <MoviePlayButton isCarousel={true} carouselData={item} />
                </View>
                <LinearGradient
                  colors={[transparent, black]}
                  locations={[0.2, 0.7589]}
                  style={styles.gradienStyle}
                />
              </View>
            </TouchableHighlight>
          );
        }}
      />
      <Pagination
        dotsLength={carouselData.length}
        activeDotIndex={activeIndex}
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          width: 200,
          alignSelf: 'center',
          paddingVertical: 0,
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </>
  );
}

export default React.memo(CarouselMob);

const styles = StyleSheet.create({
  imageSize: {height: width / 1.5, width: width},
  detailContainer: {
    position: 'absolute',
    zIndex: 2,
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    width: '100%',
    alignItems: 'center',
  },
  gradienStyle: {
    width: width,
    height: 190,
    zIndex: 1,
    position: 'absolute',
    bottom: -1,
  },
  dotsContainer: {
    position: 'absolute',
    zIndex: 10,
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    top: 255,
    height: 20,
    flexDirection: 'row',
    width: width / 4,
  },
  dotStyle: {
    width: 7,
    height: 7,
    backgroundColor: 'white',
    borderRadius: 7,
  },
});
