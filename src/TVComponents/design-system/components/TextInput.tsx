import styled from '@emotion/native';
import { SpatialNavigationNode,DefaultFocus } from 'react-tv-space-navigation';
import { TextInput as RNTextInput , BackHandler, Keyboard, Platform} from 'react-native';
import { useRef ,useEffect} from 'react';
import { Typography } from './Typography';
import { Box } from './Box';
import { Spacer } from './Spacer';
import React from 'react';

/**
 * It works, but it's not perfect.
 * If you press the back button on Android to dismiss the keyboard,
 * focus is in a weird state where we keep listening to remote control arrow movements.
 * Ideally, we'd like to always remove the native focus when the keyboard is dismissed.
 */
export const TextInputs = ({ label,onChange,value,error,readOnly }: { label: string,onChange:any,onBlur:any,value:any ,error:any,readOnly:any}) => {
  const ref = useRef<RNTextInput>(null);

  const handleKeyboardDismissal = () => {
    if (Platform.OS === 'android') {
      ref?.current?.blur(); // Remove focus from the input field
    }
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  const handleBackButtonPress = () => {
    handleKeyboardDismissal();
    return true; // Prevent default back button behavior
  };

  useEffect(() => {
    // Listen for the back button press event
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);

    // Clean up event listener on component unmount
    return () => backHandler.remove();
  }, []);

  const handleSelect = () => {
    // Focus on the input after a short delay
    setTimeout(() => {
      ref?.current?.focus();
    }, 500);
  };

  const handleBlur = () => {
    // Blur the input when the focus is lost
    ref?.current?.blur();
  };

  useEffect(() => {
    // Listen for keyboard dismissal event
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardDismissal);

    // Clean up event listener on component unmount
    return () => keyboardDidHideListener.remove();
  }, []);


  return (
    <Box>
      <Typography>{label}</Typography>
      <Spacer direction="vertical" gap="$5" />
      <DefaultFocus>
       <SpatialNavigationNode
        isFocusable={!readOnly}
        onSelect={handleSelect}
        onBlur={handleBlur}
      >
        {({ isFocused }:any) => 
        <StyledTextInput ref={ref}  value={value}
              onChangeText={onChange}
              keyboardType='email-address'
               isFocused={isFocused} 
               error={error}
               readOnly={readOnly}
               />
               }
      </SpatialNavigationNode>
      </DefaultFocus>
      <Spacer direction="vertical" gap="$5" />
    </Box>
  );
};

const StyledTextInput = styled(RNTextInput)<{ isFocused: boolean,error:any,readOnly:boolean }>(({ isFocused, theme ,error,readOnly}) => ({
  borderColor: isFocused ? 'white' : error ? 'red' :'black',
  borderWidth: 2,
  borderRadius: 8,
  color:readOnly? 'gray' : 'white',
  backgroundColor: theme.colors.background.inputBG,
  paddingHorizontal:8,
  height:55
}));
