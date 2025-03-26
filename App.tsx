import {ProgramInfo} from './src1/modules/program/domain/programInfo';
import React from 'react';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import {Amplify} from 'aws-amplify';
import awsconfig from './src/aws-exports';
import Navigation from './src/navigation';
Amplify.configure(awsconfig);

export type RootTabParamList = {
  Home: undefined;
  MovieSearch: undefined;
  // MovieSearch: undefined;
  UpdateProfile: undefined;
};

export type RootStackParamList = {
  TabNavigator: undefined;
  ProgramDetail: {programInfo: ProgramInfo};
  Player: {
    isLive: boolean,
    url: any,
    liveData: any,
  };
  MovieCastDetail: undefined;
  SignIn: undefined;
  ConfirmEmail: undefined;
  Home: undefined;
  MovieSearch: undefined;
  MovieDetail: {id: undefined};    //undefined;
  UpdateProfile: undefined;
};

function App(): JSX.Element {

  return (
    <Provider store={store}>
      <Navigation/>
    </Provider>
  );
}

export default App;
