import React from 'react';
import {View, TouchableHighlight, Platform} from 'react-native';
import PropTypes from 'prop-types';
import {black} from '../../helper/Color';
import {ImageIcon} from '../Icon/icon';
import { SpatialNavigationFocusableView } from 'react-tv-space-navigation';

const BackIcon = ({style={}, navigation, color, touchStyle = {}}) => {
 if(Platform.isTV) {
  return(
    <SpatialNavigationFocusableView
    onSelect={() => navigation.goBack()}>
             {({ isFocused }) => (
       <View style={[style,{backgroundColor:isFocused?'white':'gray'}]}>
      <View
        // hasTVPreferredFocus={true}
        // tvParallaxProperties={{
        //   enabled: true,
        //   shiftDistanceX: 1.9,
        //   shiftDistanceY: 1.9,
        //   tiltAngle: 0.1,
        //   magnification: 1.01,
        // }}
        style={touchStyle}
        // isTVSelectable={true}
        underlayColor={'transparent'}
        // onFocus={()=>console.log(' back onFocus called')}
        // onBlur={()=>console.log('back onBlur called')}
        // onPress={() => navigation.goBack()}
        >
        <ImageIcon name={'arrow-left'} size={20} color={isFocused?'black':color} />
        {/* <Icon name={'md-chevron-back'} size={32} color={color} /> */}
      </View>
    </View>)}
    </SpatialNavigationFocusableView>
  )
 } 
  return (
    <View style={style}>
      <TouchableHighlight
        hasTVPreferredFocus={true}
        tvParallaxProperties={{
          enabled: true,
          shiftDistanceX: 1.9,
          shiftDistanceY: 1.9,
          tiltAngle: 0.1,
          magnification: 1.01,
        }}
        style={touchStyle}
        isTVSelectable={true}
        underlayColor={'transparent'}
        // onFocus={()=>console.log(' back onFocus called')}
        // onBlur={()=>console.log('back onBlur called')}
        onPress={() => navigation.goBack()}>
        <ImageIcon name={'arrow-left'} size={20} color={color} />
        {/* <Icon name={'md-chevron-back'} size={32} color={color} /> */}
      </TouchableHighlight>
    </View>
  );
};

export default BackIcon;

BackIcon.propTypes = {
  style: PropTypes.object,
  navigation: PropTypes.object,
  color: PropTypes.string,
};

BackIcon.defaultProps = {
  color: black,
};
