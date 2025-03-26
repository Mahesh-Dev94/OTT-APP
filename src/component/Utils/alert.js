import {   Platform,Alert } from 'react-native'

// const alertPolyfill = (title, description, options, extra) => {
//     const result = window.confirm([title, description].filter(Boolean).join('\n'))
     
//     // if (result) {
//     //     const confirmOption = options.find(({ style }) => style === 'No')
//     //     confirmOption && confirmOption.onPress()
//     // } else {
//     //     const cancelOption = options.find(({ style }) => style === 'Yes')
//     //     cancelOption && cancelOption.onPress()
//     // }
//     if (result) {
//         const confirmOption = options.find(({ text }) => text.toLowerCase() === 'yes');
//         console.log(result,'--confirmOption--',confirmOption)
//         confirmOption && confirmOption.onPress && confirmOption.onPress();
//     } else {
//         const cancelOption = options.find(({ text }) => text.toLowerCase() === 'no');
//         console.log('cancelOption--',cancelOption)

//         cancelOption && cancelOption.onPress && cancelOption.onPress();
//     }
// }

const alertPolyfill = (title, description, buttons = []) => {
    // const result = window.confirm([title, description].filter(Boolean).join('\n'));

    // if (result) {
    //     const confirmOption = options.find(({ text }) => text.toLowerCase() === 'cancel');
    //     confirmOption && confirmOption.onPress && confirmOption.onPress();
    //     const cancelOption = options.find(({ text }) => text.toLowerCase() !== 'cancel');
    //     cancelOption && cancelOption.onPress && cancelOption.onPress();
    // } 

    const result = window.confirm([title, description].filter(Boolean).join('\n'));

    if (result === true) {
      const confirm = buttons.find(({ style }) => style !== 'cancel');
      confirm?.onPress?.();
      const cancel = buttons.find(({ style }) => style === 'cancel');
      cancel?.onPress?.();
      return;
    }

   
  
};


const alert = Platform.OS === 'web' ? alertPolyfill :  Alert.alert;

export default alert