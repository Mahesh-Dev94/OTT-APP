import mitt from 'mitt';
import { SupportedKeys } from './SupportedKeys';
import KeyEvent from 'react-native-keyevent';
import { RemoteControlManagerInterface } from './RemoteControlManager.interface';

class RemoteControlManager implements RemoteControlManagerInterface {
  constructor() {
    // KeyEvent.onKeyDownListener(this.handleKeyDown);
    KeyEvent.onKeyDownListener(this.handleKeyDown.bind(this));
    console.log('RemoteControlManager android file called')
  }

  componentDidMount() {
    // if you want to react to keyDown
    KeyEvent.onKeyDownListener((keyEvent: { keyCode: any; action: any; pressedKey: any; }) => {
      console.log(`onKeyDown keyCode: ${keyEvent.keyCode}`);
      console.log(`Action: ${keyEvent.action}`);
      console.log(`Key: ${keyEvent.pressedKey}`);
    });

    // if you want to react to keyUp
    KeyEvent.onKeyUpListener((keyEvent: { keyCode: any; action: any; pressedKey: any; }) => {
      console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
      console.log(`Action: ${keyEvent.action}`);
      console.log(`Key: ${keyEvent.pressedKey}`);
    });

    // if you want to react to keyMultiple
    KeyEvent.onKeyMultipleListener((keyEvent: { keyCode: any; action: any; characters: any; }) => {
      console.log(`onKeyMultiple keyCode: ${keyEvent.keyCode}`);
      console.log(`Action: ${keyEvent.action}`);
      console.log(`Characters: ${keyEvent.characters}`);
    });
  }
  private eventEmitter = mitt<{ keyDown: SupportedKeys }>();

  private handleKeyDown = (keyEvent: { keyCode: number }) => {
    // console.log('keyEvent.keyCode---',keyEvent.keyCode)
    const mappedKey = {
      21: SupportedKeys.Left,
      22: SupportedKeys.Right,
      20: SupportedKeys.Down,
      19: SupportedKeys.Up,
      66: SupportedKeys.Enter,
      23: SupportedKeys.Enter,
      67: SupportedKeys.Back,
    }[keyEvent.keyCode];

    if (!mappedKey) {
      return;
    }

    this.eventEmitter.emit('keyDown', mappedKey);
  };

  addKeydownListener = (listener: (event: SupportedKeys) => void) => {
    this.eventEmitter.on('keyDown', listener);
    return listener;
  };

  removeKeydownListener = (listener: (event: SupportedKeys) => void) => {
    this.eventEmitter.off('keyDown', listener);
  };
}

export default new RemoteControlManager();
