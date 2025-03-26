import styled from '@emotion/native';
import { SpatialNavigationNode, DefaultFocus } from 'react-tv-space-navigation';
import { TextInput as RNTextInput } from 'react-native';
import { useRef, useEffect } from 'react';
import { Box } from './Box';
import { Spacer } from './Spacer';
import React from 'react';
import { scaledPixels } from '../helpers/scaledPixels';

/**
 * It works, but it's not perfect.
 * If you press the back button on Android to dismiss the keyboard,
 * focus is in a weird state where we keep listening to remote control arrow movements.
 * Ideally, we'd like to always remove the native focus when the keyboard is dismissed.
 */
export const SearchTextInputs = ({ onChange, value }: { onChange: any, value: any }) => {
  const ref = useRef<RNTextInput>(null);
  const handleSelect = () => {
    // Focus on the input after a short delay
    setTimeout(() => {
      ref?.current?.focus();
    }, 500);
  };

  const handleBlur = () => {
    // Blur the input when the focus is lost
    console.log('oin blur------------------------------',ref?.current)
    ref?.current?.blur();
  };
  

  return (
    <Box>
      {/* <DefaultFocus> */}
        <SpatialNavigationNode
          isFocusable={true}
          onSelect={handleSelect}
          onBlur={handleBlur}
        >
          {({ isFocused }:any) =>
            <StyledTextInput ref={ref} value={value}
              onChangeText={onChange}
              placeholder='Search'
              keyboardType='email-address'
              isFocused={isFocused}
            />
          }
        </SpatialNavigationNode>
      {/* </DefaultFocus> */}
      <Spacer direction="vertical" gap="$5" />
    </Box>
  );
};

const StyledTextInput = styled(RNTextInput)<{ isFocused: boolean }>(({ isFocused, theme }) => ({
  borderColor: isFocused ? 'white' : 'gray',
  borderWidth: 2,
  borderRadius: 8,
  color: 'white',
  backgroundColor: theme.colors.background.inputBG,
  paddingHorizontal: 8,
  height: scaledPixels(80),   //40,
  width: scaledPixels(550),
  alignSelf:'center',
  textAlignVertical: 'center',
}));
