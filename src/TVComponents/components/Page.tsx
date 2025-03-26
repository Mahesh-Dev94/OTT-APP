import { Direction } from '@bam.tech/lrud';
import { useIsFocused } from '@react-navigation/native';
import { ReactNode, useCallback, useEffect } from 'react';
import { DefaultFocus, SpatialNavigationRoot, SpatialNavigationScrollView, useLockSpatialNavigation } from 'react-tv-space-navigation';
import { useMenuContext } from './Menu/MenuContext';
import { Keyboard,StatusBar,
  View,
  SafeAreaView,
  Platform,
  StyleSheet,} from 'react-native';
import { black } from '../../helper/Color';
import React from 'react';

type Props = { children: ReactNode ,style:any};

/**
 * Locks/unlocks the navigator when the native keyboard is shown/hidden.
 * Allows for the native focus to take over when the keyboard is open,
 * and to go back to our own system when the keyboard is closed.
 */
const SpatialNavigationKeyboardLocker = () => {
  const lockActions = useLockSpatialNavigation();
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      lockActions.unlock();
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      lockActions.unlock();
    });
    // console.log('lockActions---',lockActions)
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
   
  }, [lockActions]);

  return null;
};

export const Page = ({ children,style }: Props) => {
  const isFocused = useIsFocused();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();

  const isActive = isFocused && !isMenuOpen;

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      console.log(isActive,'---movement---',movement)
      if (movement === 'left') {
        toggleMenu(true);
      }
    },
    [toggleMenu],
  );

  if(Platform.OS==='web'){
  return (
    <SpatialNavigationRoot
      isActive={isActive}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}
    >
      <SpatialNavigationKeyboardLocker />
      <DefaultFocus>
      <SpatialNavigationScrollView style={_styles.container} offsetFromStart={240}>
      {children}
      </SpatialNavigationScrollView>
      </DefaultFocus>
    </SpatialNavigationRoot>
  );
  }else if(Platform.isTV ){
    return (
      <SpatialNavigationRoot
        isActive={isActive}
        onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}
      >
        {/* <SpatialNavigationKeyboardLocker /> */}
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