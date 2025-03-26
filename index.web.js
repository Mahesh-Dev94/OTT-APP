import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {createRoot} from 'react-dom/client';
// import App from './App.web';
import App from './App';
import MontserratBold from './src/assets/fonts/Montserrat-Bold.ttf';
import MontserratLight from './src/assets/fonts/Montserrat-Light.ttf';
import MontserratMedium from './src/assets/fonts/Montserrat-Medium.ttf';
import MontserratRegular from './src/assets/fonts/Montserrat-Regular.ttf';
import MontserratSemiBold from './src/assets/fonts/Montserrat-SemiBold.ttf';
import iconFontAwesome from 'react-native-vector-icons/Fonts/FontAwesome.ttf';
import FontAwesome5_Solid from 'react-native-vector-icons/Fonts/FontAwesome5_Solid.ttf';
import  './src/TVComponents/components/configureRemoteControl'
const iconFontStyles = `@font-face {
  src: url(${MontserratBold});
  font-family: Montserrat-Bold;
}
@font-face {
  src: url(${MontserratLight});
  font-family:  Montserrat-Light;
}
@font-face {
  src: url(${MontserratMedium});
  font-family: Montserrat-Medium;
}
@font-face {
  src: url(${MontserratRegular});
  font-family: Montserrat-Regular;
}
@font-face {
  src: url(${MontserratSemiBold});
  font-family: Montserrat-SemiBold;
}
@font-face {
  src: url(${require('react-native-vector-icons/Fonts/FontAwesome.ttf')}) format(truetype);
  font-family: "FontAwesome";
}
@font-face {
  src: url(${require('react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf')}) format(truetype);
  font-family: "FontAwesome";
}
@font-face {
  src: url(${require('react-native-vector-icons/Fonts/Ionicons.ttf')}) format(truetype);
  font-family: "FontAwesome";
}
@font-face {
  src: url(${iconFontAwesome});
  font-family: FontAwesome;
}
@font-face {
  src: url(${FontAwesome5_Solid});
  font-family: FontAwesome5_Solid;
}`;



const style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
  style.styleSheet.cssText = iconFontStyles;
} else {
  style.appendChild(document.createTextNode(iconFontStyles));
}

// Inject stylesheet
document.head.appendChild(style);
if (module.hot) {
  module.hot.accept();
}
// AppRegistry.registerComponent(appName, () => App);
// AppRegistry.runApplication(appName, {
//   initialProps: {},
//   rootTag: document.getElementById('app-root'),
// });
const container = document.getElementById('app-root'); 
const root = createRoot(container); 
root.render(<App tab="home" />);

