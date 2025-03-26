import { forwardRef } from 'react';
import { Animated, View, Text, Platform, TouchableOpacity } from 'react-native';
import {
	SpatialNavigationFocusableView,
  useSpatialNavigatorFocusableAccessibilityProps,
} from 'react-tv-space-navigation';
import { Typography } from './Typography';
import styled from '@emotion/native';
import { useFocusAnimation } from '../helpers/useFocusAnimation';
import { scaledPixels } from '../helpers/scaledPixels';
import Icon from 'react-native-vector-icons/FontAwesome';
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
        style={anim}
        isFocused={isFocused}
        ref={ref}
        {...accessibilityProps}>
        {type === 'icon' ? (
          <Icon
            name={label}
            size={isFocused ? scaledPixels(30) : scaledPixels(30)}
            color={isFocused ? 'black' : 'white'}
            style={{paddingHorizontal:10}}
          />
        ) : (
          <ColoredTypography isFocused={isFocused}>{label}</ColoredTypography>
        )}
      </Container>
    );
  },
);

ButtonContent.displayName = 'ButtonContent';

export const Button = ({ label, onSelect, type }: ButtonProps) => {

  if (Platform.isTV || Platform.OS === 'web') {
    return (
      <SpatialNavigationFocusableView  onSelect={onSelect}>
        {({ isFocused }) => (
          <ButtonContent label={label} isFocused={isFocused} type={type} />
        )}
      </SpatialNavigationFocusableView>
    )
  } else {
    return (
      <TouchableOpacity onPress={onSelect} >
        <ButtonContent label={label} isFocused={false} type={type} />
      </TouchableOpacity>
    )
  }
};

const Container = styled(Animated.View)<{ isFocused: boolean }>(
  ({ isFocused, theme }) => ({
    alignSelf: 'baseline',
    backgroundColor: isFocused ? 'white' : 'gray',
    padding: theme.spacings.$3,
    borderRadius: scaledPixels(12),
  }),
);

const ColoredTypography = styled(Typography)<{ isFocused: boolean }>(
  ({ isFocused }) => ({
    color: isFocused ? 'black' : 'white',
  }),
);
