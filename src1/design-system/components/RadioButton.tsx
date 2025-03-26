import styled from '@emotion/native';
import { SpatialNavigationNode } from 'react-tv-space-navigation';
import { TextInput as RNTextInput } from 'react-native';
import { useRef } from 'react';
import { Typography } from './Typography';
import { Box } from './Box';
import { Spacer } from './Spacer';
import React from 'react';
import { RadioButton } from 'react-native-paper';
/**
 * It works, but it's not perfect.
 * If you press the back button on Android to dismiss the keyboard,
 * focus is in a weird state where we keep listening to remote control arrow movements.
 * Ideally, we'd like to always remove the native focus when the keyboard is dismissed.
 */
export const RadioButtons = ({ label,onChange,value,error }: { label: string,onChange:any,onBlur:any,value:any ,error:any}) => {
  const ref = useRef<RNTextInput>(null);

  return (
    <Box>
      <Typography>{label}</Typography>
      <Spacer direction="vertical" gap="$5" />
       <SpatialNavigationNode
        isFocusable
        onSelect={() => {
          setTimeout(() => {
            ref?.current?.focus();
          }, 500);
         
        }}
        onFocus={() => {
          // ref?.current?.focus();
        }}
        onBlur={() => {
          ref?.current?.blur();
        }}
      >
        {({ isFocused }) => 
		<StyledTextInput ref={ref}  value={value}
              onChangeText={onChange}
               isFocused={isFocused} 
               error={error}
               />

			   }
      </SpatialNavigationNode>
      <Spacer direction="vertical" gap="$5" />
    </Box>
  );
};

const StyledTextInput = styled(RNTextInput)<{ isFocused: boolean,error:any }>(({ isFocused, theme ,error}) => ({
  borderColor: isFocused ? 'white' : error ? 'red' :'black',
  borderWidth: 2,
  borderRadius: 8,
  color: 'white',
  backgroundColor: theme.colors.background.mainHover,
}));
