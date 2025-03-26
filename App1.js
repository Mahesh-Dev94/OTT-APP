// import { PlayerInfo, ProgramInfo } from './src/TVComponents/modules/program/domain/programInfo';
// import React, { useEffect } from 'react';
// import {Provider} from 'react-redux';
// import {store} from './redux/store'; 
// import Navigation from './src/navigation';
// import {Amplify} from 'aws-amplify';
// import awsconfig from './src/aws-exports';
// import { Platform } from 'react-native';
// declare module 'react-native-vector-icons/FontAwesome5';

// // Amplify.configure(awsconfig);

// const authConfig = {
//   ...awsconfig.oauth, // Preserve other Auth settings
//   oauth: {
//     ...awsconfig.oauth, // Preserve other OAuth settings
//     redirectSignIn: Platform.OS==='web'?"http://localhost:8080/": "myapp://"
//   },
// };

// Amplify.configure({
//   ...awsconfig,
//   oauth: authConfig,
//   Analytics: {
//     disabled: false,
//   },
// });


// export type RootStackParamList = {
//   Home: undefined;
//   MovieDetail: { programInfo: ProgramInfo };
//   Player: {PlayerInfo:PlayerInfo};
//   NewPassword:undefined
// };

// function App(): JSX.Element {

//   return (
//     <Provider store={store}>
//    <Navigation/>
//     </Provider>
//   );
// }

// export default App;


import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navigation from './src/navigation';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';

Amplify.configure(awsconfig);

function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

export default App;
