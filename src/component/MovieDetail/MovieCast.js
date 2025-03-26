import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  ScrollView,
  Platform,
  Animated
} from 'react-native';
import { getImageUrl } from '../../api/url';
import { gray, transparent, white } from '../../helper/Color';
import { normalize } from '../../helper/FontSize';
import { FocusButton } from 'react-native-tv-selected-focus/src';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import CreateResponsiveStyle from '../../helper/responsiveStyle';
import { SpatialNavigationNode,SpatialNavigationFocusableView, SpatialNavigationVirtualizedList, SpatialNavigationView, SpatialNavigationScrollView } from 'react-tv-space-navigation';
// import { Typography } from '../../TVComponents/design-system/components/Typography';
// import { Spacer } from '../../TVComponents/design-system/components/Spacer';
// import { theme } from '../../TVComponents/design-system/theme/theme';
// import { Box } from '../../TVComponents/design-system/components/Box';
import styled from '@emotion/native';
// import { useFocusAnimation } from '../../TVComponents/design-system/helpers/useFocusAnimation';
import { useSpatialNavigatorFocusableAccessibilityProps } from 'react-tv-space-navigation';
import Images from '../Utils/ImageComponent';
import { LeftArrow, RightArrow } from '../../../src1/design-system/components/Arrows';
import { theme } from '../../../src1/design-system/theme/theme';
import { Typography } from '../../../src1/design-system/components/Typography';
import { Spacer } from '../../../src1/design-system/components/Spacer';
import { Box } from '../../../src1/design-system/components/Box';
import { useFocusAnimation } from '../../../src1/design-system/helpers/useFocusAnimation';
import { scaledPixels } from '../../../src1/design-system/helpers/scaledPixels';

const isWider = Platform.isTV || Platform.OS === 'web'
const MovieCast = ({ color, focusOn, onFocus }) => {
  const fontColor = white;
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const { movieDetailData } = useSelector(state => state.movie);
  let movieDetail = movieDetailData.find(data => data.movieData.id === id);

  const flatListRef = useRef(null);
  const [Index, setIndex] = useState(0);
  const [elementWidth, setElementWidth] = useState(0);
  const credits = movieDetail ? movieDetail?.credits : [];
  const cast = credits?.cast?.slice(0, 15);
  // Function to scroll to a specific index
  const scrollToIndex = index => {
    // handleItemPressRight(index);
    // onFocus(combinedArray[index].profileName);
  };

  handleItemPressRight = i => {
    const scrollY = i * elementWidth + 10; /* height of each row */
    // Scroll to the calculated position
    if (flatListRef.current) {
      flatListRef.current.scrollTo({ x: scrollY, animated: true });
    }
  };

  onLayout = event => {
    const { width } = event.nativeEvent.layout;
    setElementWidth(width);
  };

  const renderItem = (item, index) => (
    <Cast
      index={index}
      cast={item}
      data={cast}
      fontColor={fontColor}
      navigation={navigation}
      scrollToIndex={scrollToIndex}
      focusOn={focusOn}
    />
  );

  const TVrenderItem = ({ item }) => {
    return (
      <WiderCast
        cast={item}
        data={cast}
        navigation={navigation}
      />
    )
  };

  if (isWider) {
    return cast && cast.length > 0 ? (
      <Box direction="vertical">
        <Typography variant="title" fontWeight="strong">
          <Spacer direction="Horizontal" gap="$5" /> 
          {'Cast'}
        </Typography>
        <Spacer direction="vertical" gap="$2" />
        <View style={{ height: Platform.OS === 'ios' ? 280 : 240, paddingVertical: 10, marginHorizontal: 10 }}>
          {/* <SpatialNavigationVirtualizedList
            style={{ paddingVertical: 20, paddingHorizontal: 10 }}
            orientation="horizontal"
            data={cast}
            renderItem={TVrenderItem}
            itemSize={theme.sizes.program.portrait.width + 30}
            numberOfRenderedItems={cast.length + 2}
            numberOfItemsVisibleOnScreen={cast.length <= 5 ? cast.length : 5}
          /> */}
           <SpatialNavigationNode>
      {({ isActive }) => (
           <SpatialNavigationVirtualizedList
            orientation={'horizontal'}
            data={cast}
            renderItem={TVrenderItem}
            itemSize={ theme.sizes.program.portrait.width + 30}
            numberOfRenderedItems={cast.length + 2}
            numberOfItemsVisibleOnScreen={cast.length <= 5 ? cast.length : 5}
            onEndReachedThresholdItemsNumber={cast.length <= 5 ? cast.length : 5}
            descendingArrow={isActive ? <LeftArrow /> : <View />}
            descendingArrowContainerStyle={Styles.leftArrowContainer}
            ascendingArrow={isActive ? <RightArrow /> : <View />}
            ascendingArrowContainerStyle={Styles.rightArrowContainer}
          />
      )}
      </SpatialNavigationNode>

        </View>
       { Platform.OS === 'ios' && <Spacer direction="vertical" gap="$20" />}
        <Spacer direction="vertical" gap="$10" />
      </Box>
    ) : null
  }

  return cast && cast.length > 0 ? (
    <>
      <Text style={[Styles.titleText, { color: fontColor }]}>Cast</Text>
      <ScrollView
        horizontal={true}
        style={{ paddingVertical: 20, paddingHorizontal: 10 }}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}>
        {cast.map((item, index) => {
          return (
            <View key={index}>
              {renderItem(item, index)}
            </View>
          );
        })}
      </ScrollView>
    </>
  ) : null;
};

const Cast = React.memo(
  ({ cast, fontColor, navigation, index, scrollToIndex, data, focusOn }) => {
    const imageUrl = getImageUrl(cast?.profileImage, 'uri', 'w185');

    const navigateToCastDetail = () => {
      const imageUrl = getImageUrl(cast?.profileImage, 'uri', 'w185');
      navigation.navigate('MovieCastDetail', {
        name: cast.profileName,
        imageUrl: imageUrl,
      });
    };

    return (
      <FocusButton
        tvParallaxProperties={{
          enabled: true,
          shiftDistanceX: 1.5,
          shiftDistanceY: 1.5,
          tiltAngle: 0.01,
          magnification: 1.1,
        }}
        onPress={navigateToCastDetail}
        underlayColor={transparent}
        style={{ paddingHorizontal: 5 }}>
        <View style={Styles.castImageContainer}>
          {imageUrl && (
            <Image
              source={imageUrl}
              style={[
                Styles.castImage,
                cast.profileName === focusOn
                  ? { borderColor: white, borderWidth: 2 }
                  : null,
              ]}
              resizeMode={'cover'}
            />
          )}
          <View
            style={Styles.nameContainer}>
            <Text
              style={[Styles.castProfileNameText, { color: fontColor }]}
              numberOfLines={1}>
              {cast.profileName}
            </Text>
            <Text
              style={[Styles.castCharacterNameText, { color: fontColor }]}
              numberOfLines={1}>
              {cast.characterName}
            </Text>
          </View>
        </View>
      </FocusButton>
    );
  },
);

// this component use for wider view like tv and web
const WiderCast = React.memo(
  ({ cast, fontColor, navigation }) => {
    const imageUrl = getImageUrl(cast?.profileImage, 'uri', 'w185');

    const navigateToCastDetail = () => {
      const imageUrl = getImageUrl(cast?.profileImage, 'uri', 'w185');
      navigation.navigate('MovieCastDetail', {
        name: cast.profileName,
        imageUrl: imageUrl,
      });
    };

    return (
      <SpatialNavigationFocusableView
        onFocus={() => console.log('Node gained focus')}
        onSelect={() => navigateToCastDetail()}
        isFocusable>
        {({ isFocused }) => {
          const scaleAnimation = useFocusAnimation(isFocused);
          const accessibilityProps = useSpatialNavigatorFocusableAccessibilityProps();
          return (<View style={Styles.castImageContainer}>
            <ProgramContainer
              // style={scaleAnimation}
              isFocused={isFocused}
              {...accessibilityProps} >
              {imageUrl && (
                <ProgramImage isFocused={isFocused} source={imageUrl} />
              )}
            </ProgramContainer>
            {Platform.OS === 'web' ? <View
              style={[Styles.nameContainer, { paddingVertical: isFocused ? 10 : 0 ,justifyContent:'center',alignItems:'center',alignSelf:'center'}]}>
              <Typography color={'white'} width={theme.sizes.program.portrait.width} numberOfLines={1} variant="body" fontWeight="regular" >
                {cast.profileName}
              </Typography>
            </View> :
              <View
                style={Styles.nameContainer}>
                <Text 
                  style={[Styles.castProfileNameText, { color: '#ffffff' }]}
                  numberOfLines={1}>
                  {cast.profileName}
                </Text>
                <Text
                  style={[Styles.castCharacterNameText, { color: '#ffffff' }]}
                  numberOfLines={1}>
                  {cast.characterName}
                </Text>
              </View>}
          </View>
          )
        }
        }
      </SpatialNavigationFocusableView>
    );
  },
);

export default MovieCast;

MovieCast.propTypes = {
  navigation: PropTypes.object,
  color: PropTypes.string,
};

const Styles = CreateResponsiveStyle(
  //web
  {
    castImageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleText: {
      fontFamily: 'Montserrat-Bold',
      fontSize: normalize(1.6),
      marginBottom: 4,
      marginTop: 15,
      paddingHorizontal: 10,
    },
    castImage: {
      width: normalize(10),
      height: normalize(10),
      borderRadius: normalize(10),
      overflow: 'hidden',
      alignSelf: 'center',
      backgroundColor: gray,
      marginHorizontal: 8,
    },
    nameContainer: {
      // flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: normalize(10),
    },
    castProfileNameText: {
      fontFamily: 'Montserrat-Regular',
      fontSize: normalize(1),
      marginTop: 10,
      // fontWeight: 'bold',
      marginLeft: 7,
    },
    castCharacterNameText: {
      fontFamily: 'Montserrat-Regular',
      fontSize: normalize(1),
      marginTop: 5,
      marginLeft: 7,
    },
    leftArrowContainer: {
      width: 120,
      height: scaledPixels(260) + 2 * theme.spacings.$8,
      position: 'absolute',
      top: 0,
      justifyContent: 'center',
      alignItems: 'center',
      left: -theme.spacings.$8,
    },
    rightArrowContainer: {
      width: 120,
      height: scaledPixels(260) + 2 * theme.spacings.$8,
      position: 'absolute',
      top: 0,
      justifyContent: 'center',
      alignItems: 'center',
      right: -theme.spacings.$8,
    },
  },
  // tv
  {
    castImageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleText: {
      fontFamily: 'Montserrat-Bold',
      fontSize: normalize(1.6),
      marginBottom: 4,
      marginTop: 15,
      paddingHorizontal: 10,
    },
    castImage: {
      width: normalize(14),
      height: normalize(14),
      borderRadius: normalize(14),
      overflow: 'hidden',
      alignSelf: 'center',
      backgroundColor: gray,
      marginHorizontal: 10,
    },
    nameContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: normalize(14),
    },
    castProfileNameText: {
      fontFamily: 'Montserrat-Regular',
      fontSize: normalize(1.3),
      marginTop: 10,
      fontWeight: 'bold',
      marginLeft: 7,
    },
    castCharacterNameText: {
      fontFamily: 'Montserrat-Regular',
      fontSize: normalize(1.1),
      marginTop: 5,
      marginLeft: 7,
    },
    leftArrowContainer: {
      width: 120,
      height: scaledPixels(260) + 2 * theme.spacings.$8,
      position: 'absolute',
      top: 0,
      justifyContent: 'center',
      alignItems: 'center',
      left: -theme.spacings.$8,
    },
    rightArrowContainer: {
      width: 120,
      height: scaledPixels(260) + 2 * theme.spacings.$8,
      position: 'absolute',
      top: 0,
      justifyContent: 'center',
      alignItems: 'center',
      right: -theme.spacings.$8,
    },
  },
  // mobile
  {
    castImageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleText: {
      fontFamily: 'Montserrat-Bold',
      fontSize: normalize(1.6),
      marginBottom: 4,
      marginTop: 15,
      paddingHorizontal: 10,
    },
    castImage: {
      width: normalize(14),
      height: normalize(14),
      borderRadius: normalize(14),
      overflow: 'hidden',
      alignSelf: 'center',
      backgroundColor: gray,
      marginHorizontal: 10,
    },
    nameContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: normalize(14),
    },
    castProfileNameText: {
      fontFamily: 'Montserrat-Regular',
      fontSize: normalize(1.3),
      marginTop: 10,
      fontWeight: 'bold',
      marginLeft: 7,
    },
    castCharacterNameText: {
      fontFamily: 'Montserrat-Regular',
      fontSize: normalize(1.1),
      marginTop: 5,
      marginLeft: 7,
    },
  },
);

const ProgramImage = styled(Images)(({ isFocused, theme }) => ({
  height: '100%',
  width: '100%',
}));

const ProgramContainer = styled(Animated.View)(({ isFocused, theme }) => ({
  width: normalize(14),
  height: normalize(14),
  borderRadius: normalize(14),
  overflow: 'hidden',
  borderColor: isFocused ? 'white' : 'transparent',
  borderWidth: isFocused?3:0,
}));



