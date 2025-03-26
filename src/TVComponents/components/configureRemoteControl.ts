import { Directions, SpatialNavigation } from 'react-tv-space-navigation';
import { SupportedKeys } from './remote-control/SupportedKeys';
import { Platform } from 'react-native';
// import RemoteControlManager from './remote-control/RemoteControlManager';
let RemoteControlManager:any;

if (Platform.isTV && Platform.OS === 'ios') {
    RemoteControlManager = require('./remote-control/RemoteControlManager.ios').default;
} else if (Platform.isTV && Platform.OS === 'android') {
    RemoteControlManager = require('./remote-control/RemoteControlManager.android').default;
} else if(Platform.OS === 'web'){
    RemoteControlManager = require('./remote-control/RemoteControlManager.web').default;
}

SpatialNavigation.configureRemoteControl({
  remoteControlSubscriber: (callback) => {
    const mapping: { [key in SupportedKeys]: Directions | null } = {
      [SupportedKeys.Right]: Directions.RIGHT,
      [SupportedKeys.Left]: Directions.LEFT,
      [SupportedKeys.Up]: Directions.UP,
      [SupportedKeys.Down]: Directions.DOWN,
      [SupportedKeys.Enter]: Directions.ENTER,
      [SupportedKeys.Back]: null,
    };

    const remoteControlListener = (keyEvent: SupportedKeys) => {
      callback(mapping[keyEvent]);
    };

    return RemoteControlManager.addKeydownListener(remoteControlListener);
  },

  remoteControlUnsubscriber: (remoteControlListener) => {
    RemoteControlManager.removeKeydownListener(remoteControlListener);
  },
});
