import { Direction } from '@bam.tech/lrud';
import { useIsFocused } from '@react-navigation/native';
import { ReactNode, useCallback, useEffect } from 'react';
import { SpatialNavigationRoot, useLockSpatialNavigation } from 'react-tv-space-navigation';
import { useMenuContext } from './Menu/MenuContext';
import { Keyboard, Platform, SafeAreaView, ScrollView, StatusBar, View } from 'react-native';
import React from 'react';
// import { black } from 'helper/Color';
import { StyleSheet } from 'react-native';
import { black } from '../../src/helper/Color';   //'helper/Color';

type Props = { children: ReactNode };

/**
 * Locks/unlocks the navigator when the native keyboard is shown/hidden.
 * Allows for the native focus to take over when the keyboard is open,
 * and to go back to our own system when the keyboard is closed.
 */
const SpatialNavigationKeyboardLocker = () => {
  const lockActions = useLockSpatialNavigation();
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      lockActions.lock();
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      lockActions.unlock();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [lockActions]);

  return null;
};

export const Page = ({ children }: Props) => {
  const isFocused = useIsFocused();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();

  const isActive = isFocused && !isMenuOpen;

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      if (movement === 'left') {
        toggleMenu(true);
      }
    },
    [toggleMenu],
  );

if(Platform.isTV || Platform.OS==='web'){
  return (
    <SpatialNavigationRoot
    isActive={isActive}
    onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}
  >
    <SpatialNavigationKeyboardLocker />
   {children}
  </SpatialNavigationRoot>
  );
  }

  return(
    <View style={{flex: 1, backgroundColor: black}}>
    <SafeAreaView style={_styles.container}>
    <StatusBar barStyle="light-content" translucent />
      {children}
    </SafeAreaView>
  </View>
  )
};


const _styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: black,
    paddingTop:20
  },
});