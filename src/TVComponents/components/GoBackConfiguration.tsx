import { useNavigation } from '@react-navigation/native';
import React,{ useEffect } from 'react';
// import RemoteControlManager from  './remote-control/RemoteControlManager.web'  //'./remote-control/RemoteControlManager';
import { SupportedKeys } from './remote-control/SupportedKeys';
import { Platform } from 'react-native';


// Import the appropriate RemoteControlManager based on the platform
let RemoteControlManager:any;

if (Platform.isTV && Platform.OS === 'ios') {
    RemoteControlManager = require('./remote-control/RemoteControlManager.ios').default;
} else if (Platform.isTV && Platform.OS === 'android') {
    RemoteControlManager = require('./remote-control/RemoteControlManager.android').default;
} else if(Platform.OS === 'web'){
    RemoteControlManager = require('./remote-control/RemoteControlManager.web').default;
}

export const GoBackConfiguration = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const remoteControlListener = (pressedKey: SupportedKeys) => {
      if (pressedKey !== SupportedKeys.Back) return;
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    };
    RemoteControlManager.addKeydownListener(remoteControlListener);

    return () => RemoteControlManager.removeKeydownListener(remoteControlListener);
  }, [navigation]);

  return <></>;
};
