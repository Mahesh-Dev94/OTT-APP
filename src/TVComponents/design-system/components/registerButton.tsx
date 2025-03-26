import { forwardRef } from 'react';
import { Animated, View, Text, Platform, TouchableOpacity } from 'react-native';
import {
  SpatialNavigationNode,
  useSpatialNavigatorFocusableAccessibilityProps,
} from 'react-tv-space-navigation';
import { Typography } from './Typography';
import styled from '@emotion/native';
import { useFocusAnimation } from '../helpers/useFocusAnimation';
import { scaledPixels } from '../helpers/scaledPixels';
import Icon from 'react-native-vector-icons/FontAwesome5';
import React from 'react';

type ButtonProps = {
  label: string;
  onSelect?: () => void;
  type: string;
};

const ButtonContent = forwardRef<View, { label: string; isFocused: boolean,type:string }>(
  (props, ref) => {
    const { isFocused, label, type } = props;
    const anim = useFocusAnimation(isFocused);
    const accessibilityProps = useSpatialNavigatorFocusableAccessibilityProps();
    return (
      <Container
        // style={anim}
        type={type}
        isFocused={isFocused}
        ref={ref}
        {...accessibilityProps}>
        {type === 'icon' ? (

          <Icon
            name={label}
            size={isFocused ? scaledPixels(30) : scaledPixels(25)}
            color={isFocused ? 'black' : 'white'}
            style={label==='home' || label==='sign-out-alt' || label==='search'?{}:{paddingHorizontal:10}}
          />
        ) : (
          <ColoredTypography isFocused={isFocused} type={''}>{label}</ColoredTypography>
        )}
      </Container>
    );
  },
);

ButtonContent.displayName = 'ButtonContent';

export const Button = ({ label, onSelect, type }: ButtonProps) => {

  if (Platform.isTV || Platform.OS === 'web') {
    return (
      <SpatialNavigationNode onFocus={()=>console.log('button focus')} isFocusable onSelect={onSelect}>
        {({ isFocused }) => (
          <ButtonContent label={label} isFocused={isFocused} type={type} />
        )}
      </SpatialNavigationNode>
    )
  } else {
    return (
      <TouchableOpacity onPress={onSelect} >
        <ButtonContent label={label} isFocused={false} type={type} />
      </TouchableOpacity>
    )
  }
};

const Container = styled(Animated.View)<{ isFocused: boolean,type:string }>(
  ({ isFocused, theme,type }) => ({
    alignSelf: 'center',
    backgroundColor:(type==='outLine' || type==='text') ? 'transparent' :  isFocused ?  '#3B71F3' : '#89a7f0',
    padding: theme.spacings.$3,
    borderRadius: scaledPixels(12),
    borderWidth:2,
    borderColor:type==='outLine' ?isFocused ? 'white':'#89a7f0' :'transparent',
    justifyContent:'center',
	  width: '40%',
    paddingVertical: 10,
    marginVertical: 5,
    alignItems: 'center',

  }),
);



const ColoredTypography = styled(Typography)<{ isFocused: boolean,type:string }>(
  ({ isFocused }) => ({
    color: isFocused ?  'white'  : 'gray',
  }),
);
