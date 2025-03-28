// import mitt from 'mitt';
// import { SupportedKeys } from './SupportedKeys';
// import { HWEvent, TVEventHandler } from 'react-native';
// import { RemoteControlManagerInterface } from './RemoteControlManager.interface';

// class RemoteControlManager implements RemoteControlManagerInterface {
//   constructor() {
//     const _tvEventHandler = new TVEventHandler();
//     _tvEventHandler.enable(undefined, this.handleKeyDown);
//   }

//   private eventEmitter = mitt<{ keyDown: SupportedKeys }>();

//   private handleKeyDown = (_: unknown, evt: HWEvent) => {
//     if (!evt || typeof evt.eventType !== 'string') return;

//     const mappedKey = {
//       right: SupportedKeys.Right,
//       left: SupportedKeys.Left,
//       up: SupportedKeys.Up,
//       down: SupportedKeys.Down,
//       select: SupportedKeys.Enter,
//     }[evt.eventType as keyof typeof SupportedKeys];

//     if (!mappedKey) {
//       return;
//     }

//     this.eventEmitter.emit('keyDown', mappedKey);
//   };

//   addKeydownListener = (listener: (event: SupportedKeys) => void) => {
//     this.eventEmitter.on('keyDown', listener);
//     return listener;
//   };

//   removeKeydownListener = (listener: (event: SupportedKeys) => void) => {
//     this.eventEmitter.off('keyDown', listener);
//   };
// }

// export default new RemoteControlManager();
