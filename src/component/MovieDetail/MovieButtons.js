import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, Text, Platform} from 'react-native';
import {white} from '../../helper/Color';
import {ImageIcon} from '../Icon/icon';
import {normalize} from '../../helper/FontSize';
import {useNavigation, useRoute} from '@react-navigation/native';
import {FocusButton} from 'react-native-tv-selected-focus/src';
import {useSelector} from 'react-redux'; // Import these hooks
import {Button} from '../../../src1/design-system/components/detailsButton';   //'../../TVComponents/design-system/components/Button';
import {Spacer} from '../../../src1/design-system/components/Spacer';
import {SpatialNavigationView} from 'react-tv-space-navigation';
import alert from '../Utils/alert';
const isWider = Platform.isTV || Platform.OS === 'web';
const MovieButtons = ({color, focusOn, onFocus,onAlert}) => {
  const [fontColor, setFontColor] = useState(color ? color : white);
  const session =useSelector(state => state.hasSession.hasSession);
  const navigation = useNavigation();
  // const movieDetail = useSelector((state) => state.movie.detail);
  const route = useRoute();
  const {id} = route.params;
  const {movieDetailData} = useSelector(state => state.movie);
  let movieDetail = movieDetailData.find(data => data.movieData.id === id);
  const movieData = movieDetail?.movieData;
  const scrollToIndex = type => {
    onFocus(type);
  };

  const ShowAlert=()=>{
    alert(
      'Alert',
      'This action requires you to log in first. Would you like to log in now?', // <- this part is optional, you can pass an empty string
      [
        {text: 'cancel', onPress: () => console.log('cancel Pressed#####')},
        {text: 'Ok', onPress: () => navigation.navigate('SignIn')},
      ],
      {cancelable: false},
    );
  }

  const _watchNow=()=>{
if(!session){
  Platform.OS==='web'?onAlert():
  ShowAlert();
}else{
  navigation.navigate('Player', {
    mediaUuid: movieData.mediaUuid,
    id: movieData.id,
  })
}

  }

  if (isWider) {
    return (
      <>
        <SpatialNavigationView style={_styles.container}>
        <Button
          label={'play'}
          type={'icon'}
          onSelect={() =>_watchNow()}
        />
        <Spacer direction="horizontal" gap="$10" />
        <Button label={'video-camera'} type={'icon'} />
        <Spacer direction="horizontal" gap="$10" />
        <Button label={'bookmark'} type={'icon'} />
        <Spacer direction="horizontal" gap="$10" />
        <Button label={'check-circle'} type={'icon'} />
        <Spacer direction="horizontal" gap="$10" />
        <Button label={'ellipsis-h'} type={'icon'} />
        </SpatialNavigationView>
       <View style={_styles.container1}>
        <View
          style={{flexDirection: 'row', paddingRight: 20, paddingBottom: 5}}>
          <View underlayColor={'transparent'}>
            <View>
              <View style={{flexDirection: 'row', padding: 5}}>
                <ImageIcon
                  name={'apple'}
                  size={normalize(1)}
                  color={fontColor}
                  style={_styles.icon}
                />
                <Text
                  numberOfLines={2}
                  style={[_styles.playTextSmall, {color: fontColor}]}>
                  {' '}
                  76%
                </Text>
              </View>
            </View>
          </View>
          <View style={{paddingRight: 6}} underlayColor={'transparent'}>
            <View>
              <View style={{flexDirection: 'row', padding: 5}}>
                <ImageIcon
                  name={'fire'}
                  size={normalize(1)}
                  color={fontColor}
                  style={_styles.icon}
                />
                <Text
                  numberOfLines={2}
                  style={[_styles.playTextSmall, {color: fontColor}]}>
                  {' '}
                  41%
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{flexDirection: 'row', paddingRight: 20}}>
          <View underlayColor={'transparent'}>
            <View>
              <View
                style={[
                  _styles.wrapperSmall,
                  {backgroundColor: `${fontColor}99`, borderRadius: 5},
                ]}>
                <Text
                  numberOfLines={2}
                  style={[
                    _styles.playTextSmall,
                    {color: fontColor == '#FFFFFF' ? '#000000' : '#ffffff'},
                  ]}>
                  HD
                </Text>
              </View>
            </View>
          </View>
          <View underlayColor={'transparent'}>
            <View>
              <View
                style={[
                  _styles.wrapperSmall,
                  {backgroundColor: `${fontColor}99`, borderRadius: 5},
                ]}>
                <ImageIcon
                  name={'volume-down'}
                  size={normalize(1)}
                  color={fontColor == '#FFFFFF' ? '#000000' : '#ffffff'}
                  style={_styles.icon}
                />
                <Text
                  numberOfLines={2}
                  style={[
                    _styles.playTextSmall,
                    {color: fontColor == '#FFFFFF' ? '#000000' : '#ffffff'},
                  ]}>
                  {' '}
                  AAC
                </Text>
              </View>
            </View>
          </View>
          <View style={{paddingRight: 6}} underlayColor={'transparent'}>
            <View>
              <View
                style={[
                  _styles.wrapperSmall,
                  {backgroundColor: `${fontColor}99`, borderRadius: 5},
                ]}>
                <ImageIcon
                  name={'credit-card'}
                  size={normalize(1)}
                  color={fontColor == '#FFFFFF' ? '#000000' : '#ffffff'}
                  style={_styles.icon}
                />
                <Text
                  numberOfLines={2}
                  style={[
                    _styles.playTextSmall,
                    {color: fontColor == '#FFFFFF' ? '#000000' : '#ffffff'},
                  ]}>
                  {' '}
                  Off
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View></>
    );
  }

  return (
    <View>
        <View style={_styles.container}>
          <FocusButton
            blockFocusLeft={true}
            hasTVPreferredFocus={true}
            tvParallaxProperties={{
              enabled: true,
              shiftDistanceX: 1.9,
              shiftDistanceY: 1.9,
              tiltAngle: 0.05,
              magnification: 1.15,
            }}
            onPress={() => _watchNow()}
            onFocus={() => scrollToIndex('play')}
            isTVSelectable={true}
            style={{paddingRight: 6}}
            underlayColor={'transparent'}>
            <View>
              <View
                style={[
                  _styles.wrapper,
                  {backgroundColor: `${fontColor}99`, borderRadius: 5},
                  focusOn === 'play'
                    ? {borderColor: 'white', borderWidth: 2}
                    : null,
                ]}>
                <ImageIcon
                  name={'play'}
                  size={normalize(1.6)}
                  color={fontColor == '#FFFFFF' ? '#000000' : '#ffffff'}
                  style={_styles.icon}
                />
              </View>
              <Text
                numberOfLines={2}
                style={[_styles.playText, {color: fontColor}]}>
                Play
              </Text>
            </View>
          </FocusButton>

          <FocusButton
            // isTVSelectable={false}
            hasTVPreferredFocus={false}
            tvParallaxProperties={{
              enabled: true,
              shiftDistanceX: 1.9,
              shiftDistanceY: 1.9,
              tiltAngle: 0.05,
              magnification: 1.15,
            }}
            style={_styles.button}
            onFocus={() => scrollToIndex('Watch the Trailer')}
            underlayColor={'transparent'}>
            <View>
              <View
                style={[
                  _styles.wrapper,
                  {backgroundColor: `${fontColor}99`, borderRadius: 5},
                  focusOn === 'Watch the Trailer'
                    ? {borderColor: 'white', borderWidth: 2}
                    : null,
                ]}>
                <ImageIcon
                  name={'video-camera'}
                  size={normalize(1.6)}
                  color={fontColor == '#FFFFFF' ? '#000000' : '#ffffff'}
                  style={_styles.icon}
                />
              </View>
              <Text
                numberOfLines={2}
                style={[_styles.playText, {color: fontColor}]}>
                Watch the Trailer
              </Text>
            </View>
          </FocusButton>

          <FocusButton
            // isTVSelectable={false}
            hasTVPreferredFocus={false}
            tvParallaxProperties={{
              enabled: true,
              shiftDistanceX: 1.9,
              shiftDistanceY: 1.9,
              tiltAngle: 0.05,
              magnification: 1.15,
            }}
            style={_styles.button}
            onFocus={() => scrollToIndex('Add to Watchlist')}
            underlayColor={'transparent'}>
            <View>
              <View
                style={[
                  _styles.wrapper,
                  {backgroundColor: `${fontColor}99`, borderRadius: 5},
                  focusOn === 'Add to Watchlist'
                    ? {borderColor: 'white', borderWidth: 2}
                    : null,
                ]}>
                <ImageIcon
                  name={'bookmark'}
                  size={normalize(2)}
                  color={fontColor == '#FFFFFF' ? '#000000' : '#ffffff'}
                  style={_styles.icon}
                />
              </View>
              <Text
                numberOfLines={2}
                style={[_styles.playText, {color: fontColor}]}>
                Add to Watchlist
              </Text>
            </View>
          </FocusButton>

          <FocusButton
            // isTVSelectable={false}
            hasTVPreferredFocus={false}
            tvParallaxProperties={{
              enabled: true,
              shiftDistanceX: 1.9,
              shiftDistanceY: 1.9,
              tiltAngle: 0.05,
              magnification: 1.15,
            }}
            style={_styles.button}
            onFocus={() => scrollToIndex('Mark as Played')}
            underlayColor={'transparent'}>
            <View>
              <View
                style={[
                  _styles.wrapper,
                  {backgroundColor: `${fontColor}99`, borderRadius: 5},
                  focusOn === 'Mark as Played'
                    ? {borderColor: 'white', borderWidth: 2}
                    : null,
                ]}>
                <ImageIcon
                  name={'check-circle'}
                  size={normalize(1.6)}
                  color={fontColor == '#FFFFFF' ? '#000000' : '#ffffff'}
                  style={_styles.icon}
                />
              </View>
              <Text
                numberOfLines={2}
                style={[_styles.playText, {color: fontColor}]}>
                Mark as Played
              </Text>
            </View>
          </FocusButton>

          <FocusButton
            // isTVSelectable={false}
            hasTVPreferredFocus={false}
            blockFocusRight={true}
            tvParallaxProperties={{
              enabled: true,
              shiftDistanceX: 1.9,
              shiftDistanceY: 1.9,
              tiltAngle: 0.05,
              magnification: 1.15,
            }}
            style={_styles.button}
            onFocus={() => scrollToIndex('More')}
            underlayColor={'transparent'}>
            <View>
              <View
                style={[
                  _styles.wrapper,
                  {backgroundColor: `${fontColor}99`, borderRadius: 5},
                  focusOn === 'More'
                    ? {borderColor: 'white', borderWidth: 2}
                    : null,
                ]}>
                <ImageIcon
                  name={'ellipsis-h'}
                  size={normalize(1.6)}
                  color={fontColor == '#FFFFFF' ? '#000000' : '#ffffff'}
                  style={_styles.icon}
                />
              </View>
            </View>
          </FocusButton>
        </View>

      <View style={_styles.container1}>
        <View
          style={{flexDirection: 'row', paddingRight: 20, paddingBottom: 5}}>
          <View underlayColor={'transparent'}>
            <View>
              <View style={{flexDirection: 'row', padding: 5}}>
                <ImageIcon
                  name={'apple'}
                  size={normalize(1)}
                  color={fontColor}
                  style={_styles.icon}
                />
                <Text
                  numberOfLines={2}
                  style={[_styles.playTextSmall, {color: fontColor}]}>
                  {' '}
                  76%
                </Text>
              </View>
            </View>
          </View>
          <View style={{paddingRight: 6}} underlayColor={'transparent'}>
            <View>
              <View style={{flexDirection: 'row', padding: 5}}>
                <ImageIcon
                  name={'fire'}
                  size={normalize(1)}
                  color={fontColor}
                  style={_styles.icon}
                />
                <Text
                  numberOfLines={2}
                  style={[_styles.playTextSmall, {color: fontColor}]}>
                  {' '}
                  41%
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{flexDirection: 'row', paddingRight: 20}}>
          <View underlayColor={'transparent'}>
            <View>
              <View
                style={[
                  _styles.wrapperSmall,
                  {backgroundColor: `${fontColor}99`, borderRadius: 5},
                ]}>
                <Text
                  numberOfLines={2}
                  style={[
                    _styles.playTextSmall,
                    {color: fontColor == '#FFFFFF' ? '#000000' : '#ffffff'},
                  ]}>
                  HD
                </Text>
              </View>
            </View>
          </View>
          <View underlayColor={'transparent'}>
            <View>
              <View
                style={[
                  _styles.wrapperSmall,
                  {backgroundColor: `${fontColor}99`, borderRadius: 5},
                ]}>
                <ImageIcon
                  name={'volume-down'}
                  size={normalize(1)}
                  color={fontColor == '#FFFFFF' ? '#000000' : '#ffffff'}
                  style={_styles.icon}
                />
                <Text
                  numberOfLines={2}
                  style={[
                    _styles.playTextSmall,
                    {color: fontColor == '#FFFFFF' ? '#000000' : '#ffffff'},
                  ]}>
                  {' '}
                  AAC
                </Text>
              </View>
            </View>
          </View>
          <View style={{paddingRight: 6}} underlayColor={'transparent'}>
            <View>
              <View
                style={[
                  _styles.wrapperSmall,
                  {backgroundColor: `${fontColor}99`, borderRadius: 5},
                ]}>
                <ImageIcon
                  name={'credit-card'}
                  size={normalize(1)}
                  color={fontColor == '#FFFFFF' ? '#000000' : '#ffffff'}
                  style={_styles.icon}
                />
                <Text
                  numberOfLines={2}
                  style={[
                    _styles.playTextSmall,
                    {color: fontColor == '#FFFFFF' ? '#000000' : '#ffffff'},
                  ]}>
                  {' '}
                  Off
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MovieButtons;

MovieButtons.propTypes = {
  navigation: PropTypes.object,
  font_color: PropTypes.string,
};

const _styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    flexDirection: 'row',
    paddingLeft: 10,
  },
  container1: {
    paddingTop: 5,
    marginTop: 30,
    alignItems: 'flex-end',
  },
  button: {
    paddingHorizontal: 8,
  },
  wrapper: {
    height: normalize(3.1),
    width: normalize(5.1),
    justifyContent: 'center',
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  wrapperSmall: {
    borderRadius: 5,
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 6,
    marginHorizontal: 5,
  },

  icon: {
    alignSelf: 'center',
  },
  playText: {
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    fontSize: normalize(1),
    justifyContent: 'center',
    alignSelf: 'center',
    width: normalize(6),
    marginTop: 8,
  },
  playTextSmall: {
    fontFamily: 'Montserrat-bold',
    textAlign: 'center',
    fontSize: normalize(0.8),
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
