import styled from '@emotion/native';
import { SpatialNavigationNode, DefaultFocus } from 'react-tv-space-navigation';
import { Platform, TextInput as RNTextInput } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import { Box } from './Box';
import { Spacer } from './Spacer';
import React from 'react';
import { scaledPixels } from '../helpers/scaledPixels';
import { normalize } from '../../../src/helper/FontSize';  //'../helper/FontSize';

/**
 * It works, but it's not perfect.
 * If you press the back button on Android to dismiss the keyboard,
 * focus is in a weird state where we keep listening to remote control arrow movements.
 * Ideally, we'd like to always remove the native focus when the keyboard is dismissed.
 */
export const SearchTextInputs = ({ onChange, value }: { onChange: any, value: any }) => {
  const ref = useRef<RNTextInput>(null);
  const [isEditable,setisEditable]=useState(true);
  const conditionalProps = Platform.OS === 'ios' ? { editable: isEditable } : {};
  const handleSelect = () => {
    // Focus on the input after a short delay
    setTimeout(() => {
      setisEditable(true)
      ref?.current?.focus();
    }, 500);
  };

  const handleBlur = () => {
    // Blur the input when the focus is lost
    setisEditable(false)
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
          {({ isFocused }) =>
            <StyledTextInput ref={ref} value={value}
              onChangeText={onChange}
              placeholder='Search'
              placeholderTextColor="#fff" 
              keyboardType='default'
              isFocused={isFocused}
              {...conditionalProps}
            />
          }
        </SpatialNavigationNode>
      {/* </DefaultFocus> */}
      <Spacer direction="vertical" gap="$5" />
    </Box>
  );
};

const StyledTextInput = styled(RNTextInput)<{ isFocused: boolean }>(({ isFocused, theme }) => ({
  borderColor: isFocused ? 'white' : theme.colors.background.inputBG,
  borderWidth:2,
  borderRadius: 8,
  color: 'white',
  backgroundColor: theme.colors.background.inputBG,
  paddingHorizontal: 8,
  height: scaledPixels(80),   //40,
  width: scaledPixels(550),
  alignSelf:'center',
  textAlignVertical: 'center',
  fontSize:normalize(1.3)
}));
