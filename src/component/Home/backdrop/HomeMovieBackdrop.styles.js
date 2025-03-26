import {Dimensions} from 'react-native';
import {black} from '../../../helper/Color';
import CreateResponsiveStyle from '../../../helper/responsiveStyle';

export const styles = CreateResponsiveStyle(
  {
    //WEB
    wrapper: {flex: 1, backgroundColor: black},
    scrollWrapper: {flex: 1, height: '100%'},
    imageStyle: {
      flex: 1,
      position: 'absolute',
      height: '30%',
      width: '100%',
      zIndex: -2,
    },
    linear_grad: {
      position: 'absolute',
      zIndex: -1,
      height: '30%',
      width: '100%',
    },
    linear_grad2: {
      position: 'absolute',
      zIndex: -1,
      height: '30%',
      width: '55%',
    },
    gradientTv: {
      flex: 1,
      position: 'absolute',
      height: '100%',
      width: '100%',
    },
  },
  {
    // TV
    wrapper: {height: Dimensions.get('window').height, backgroundColor: black},
    imageStyle: {
      flex: 1,
      height: Dimensions.get('window').width * 1.7777,
      width: Dimensions.get('window').width,
    },
    gradientTv: {
      flex: 1,
      position: 'absolute',
      height: '100%',
      width: '100%',
    },
    fixedPos: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // justifyContent: 'flex-start',
      // alignItems: 'flex-start',
      // with:'100%'
    },
  },
  {
    // MOBILE
    wrapper: {flex: 1},
  },
);
