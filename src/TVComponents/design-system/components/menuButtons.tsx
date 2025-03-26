import {forwardRef} from 'react';
import {Animated, View, Text, Platform, TouchableOpacity} from 'react-native';
import {
  SpatialNavigationNode,
  useSpatialNavigatorFocusableAccessibilityProps,
} from 'react-tv-space-navigation';
import {Typography} from './Typography';
import styled from '@emotion/native';
import {useFocusAnimation} from '../helpers/useFocusAnimation';
import {scaledPixels} from '../helpers/scaledPixels';
import Icon from 'react-native-vector-icons/FontAwesome5';
import React from 'react';

type ButtonProps = {
  label: string;
  onSelect?: () => void;
  isMenuOpen: boolean;
  type: any;
};

const ButtonContent = forwardRef<
  View,
  {label: string; isFocused: boolean; isMenuOpen: boolean,type:any}
>((props, ref) => {
  const {isFocused, isMenuOpen, label, type} = props;
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
        />
      ) : (
        <ColoredTypography isFocused={isFocused}>{label}</ColoredTypography>
      )}
    </Container>
  );
});

ButtonContent.displayName = 'ButtonContent';

export const Button = ({label, onSelect, type, isMenuOpen}: ButtonProps) => {
  return (
    <SpatialNavigationNode isFocusable onSelect={onSelect}>
      {({isFocused}) => (
        <ButtonContent
          label={label}
          isFocused={isFocused && isMenuOpen}
          type={type}
          isMenuOpen={isMenuOpen}
        />
      )}
    </SpatialNavigationNode>
  );
};

const Container = styled(Animated.View)<{isFocused: boolean}>(
  ({isFocused, theme}) => ({
    alignSelf: 'baseline',
    backgroundColor: isFocused ? 'white' : 'gray',
    padding: theme.spacings.$3,
    borderRadius: scaledPixels(12),
  }),
);

const ColoredTypography = styled(Typography)<{isFocused: boolean}>(
  ({isFocused}) => ({
    color: isFocused ? 'black' : 'white',
  }),
);
