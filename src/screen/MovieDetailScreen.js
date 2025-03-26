import React, {useEffect, useState, useMemo} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  TVEventControl,
  BackHandler,
  Platform,
} from 'react-native';
import {black, transparent} from '../helper/Color';
import BackIcon from '../component/Utils/BackIcon';
import Screen from '../component/Screen';
import {InfoDetailContainer} from '../component/MovieDetail/InfoDetail/InfoDetailContainer';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearMovieDetailData,
  fetchMovieDetailScreen,
} from '../../redux/reducers/details';
import { Page } from '../../src1/components/Page'    //'../TVComponents/components/Page';
import { setroute } from '../../redux/reducers/routeName';
import { useIsFocused, useNavigation } from '@react-navigation/native';


const MovieDetailScreen = ({route, navigation}) => {
  // const { currentTime } = route.params;
  const {id} = route.params;
  const [isLoaded, setIsLoaded] = useState(false);
  const [bg_color, setBgColor] = useState('#000000');
  const [font_color, setFontColor] = useState('#ffffff');
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();
  const isFocused =useIsFocused();
  // const navigation = useNavigation();
  useEffect(() => {
    if(isFocused)
    dispatch(setroute('details'))
    console.log('set route ***** details')
  }, [isFocused]);

  useEffect(() => {
    console.log('id----',id)
    dispatch(fetchMovieDetailScreen({id: id, type: true})).then(response => {
      setIsLoaded(true); // Set isLoaded to true after fetching details
    }); // Update type as needed
 
  }, []);

  const handleBackButtonClick = () => {
    navigation.goBack(null);
    const {routes} = navigation.getState();
    if (routes.length === 1) {
      dispatch(clearMovieDetailData());
    }
    return true;
  };

  useEffect(() => {
    // const { currentTime } = route.params;

    if (Platform.isTV && Platform.OS === 'ios') {
      TVEventControl.enableTVMenuKey();
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick,
    );

    return () => {
      backHandler.remove();
    };
  }, [navigation, route.params]);

  const renderedContent = useMemo(() => {
    if (!isLoaded) {
      return <View style={Styles.ActivityIndicator} />;
    }

    return (
      <InfoDetailContainer
        font_color={font_color}
        bg_color={bg_color}
      />
    );
  });

  return (
    <Page>
        {renderedContent}
        {Platform.isTV || Platform.OS === 'web' ? null : (
          <BackIcon
            navigation={navigation}
            style={Styles.backContainer}
            touchStyle={Styles.touchStyle}
            color={'white'}
          />
        )}
    </Page>
  );
};

export default MovieDetailScreen;

MovieDetailScreen.propTypes = {
  route: PropTypes.any,
  navigation: PropTypes.object,
};

const Styles = StyleSheet.create({
  scrollview: {
    backgroundColor: transparent,
    flex: 1,
  },
  movieDetailWrapper: {
    flex: 1,
    paddingBottom: 50,
  },
  movieDetail: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: black,
  },
  gradientImage: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  ActivityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:black
  },
  backContainer: {
    height: 50,
    width: 50,
    borderRadius: 50,
    position: 'absolute',
    top: 35,
    left: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  touchStyle: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
