import React, { useEffect, useMemo,useState } from 'react';
import { black } from '../helper/Color';
import { Platform, StyleSheet, Text, View} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import  '../../src1/components/configureRemoteControl';   //'../components/configureRemoteControl';
import {
  fetchHomePageDetails,
  setSelectedDetailHome,
} from '../../redux/reducers/movieSwimlane';
import { setGlobalID } from '../../redux/reducers/globalSlice';
import Screen from '../component/Screen';
import MoviesRow from '../component/Home/MoviesRow';
import HomeMovieBackdrop from '../component/Home/backdrop/HomeMovieBackdrop';
import MovieTitle from '../component/Home/HomeMovieTitle';
import MovieGenres from '../component/Home/HomeMovieGenres';
import MovieOverview from '../component/Home/HomeMovieOverview';
import MoviePlayButton from '../component/Home/HomeMoviePlayButton';
import { getPlatformType, platformType } from '../helper/platformType';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import UserInfo from '../component/Home/userInfo';
import { Page } from '../../src1/components/Page'//'../TVComponents/components/Page'   //'../../src/components/Page';
import ScrollContainer from '../component/Home/scrollContainer';
import { ProgramListWithTitle } from '../../src1/modules/program/view/ProgramListWithTitle'  //'../TVComponents/modules/program/view/ProgramListWithTitle'  //;
import { Box } from '../../src1/design-system/components/Box'   //'../TVComponents/design-system/components/Box'   //'../../src/design-system/components/Box';
import { setroute } from '../../redux/reducers/routeName';
import SplashScreen from 'react-native-splash-screen';
import AwesomeAlert from 'react-native-awesome-alerts';
import { DefaultFocus, SpatialNavigationScrollView } from 'react-tv-space-navigation';
import { BottomArrow, TopArrow } from '../../src1/design-system/components/Arrows';
import { normalize } from  '../helper/FontSize';

function MovieScreen() {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const homePageDetails = useSelector(state => state.swimlane.homePageDetails);
  const movieDetail = useSelector(state => state.movie.detail);
  const [isPopupVisible,setisPopupVisible]=useState(false)

   useEffect(() => {
    if(isFocused){
      dispatch(setroute('Home'))
    }
    
  }, [isFocused]);

  useEffect(() => {
    if (Platform.OS!='web') {
      // SplashScreen.hide();
    }
    dispatch(fetchHomePageDetails());
    // console.log('called functions []')
  }, []);



  useEffect(() => {
    if (homePageDetails) {
      let ar = homePageDetails ? homePageDetails[0].data : null;
      dispatch(setSelectedDetailHome(homePageDetails[0].data[0]));
      dispatch(setGlobalID(ar[0].id));

    }
  }, [homePageDetails]);

  const renderMovieRow = useMemo(
    () => 
    <ScrollContainer>
    {(Platform.isTV || Platform.OS==='web' ) ? homePageDetails? homePageDetails.map((item,index)=>{
            return(
              <Box padding="$5" key={index}>
              <ProgramListWithTitle title={item.title} data={item.data} />
           </Box>
            )
          }) :null:<MoviesRow homePageDetails={homePageDetails} isFocused={isFocused} />}

    </ScrollContainer>,
  //  <DefaultFocus>
  //   <SpatialNavigationScrollView
  //     offsetFromStart={140}
  //     // ascendingArrow={<BottomArrow />}
  //     // ascendingArrowContainerStyle={styles.bottomArrowContainer}
  //     // descendingArrow={<TopArrow />}
  //     // descendingArrowContainerStyle={styles.topArrowContainer}
  //   >
     

  //     {  homePageDetails? homePageDetails.map((item,index)=>{
  //           return(
  //             <Box padding="$5" key={index}>
  //             <ProgramListWithTitle title={item.title} data={item.data} />
  //          </Box>
  //           )
  //         }):null}
  //       {/* </Box> */}
  //       </SpatialNavigationScrollView>
  //       </DefaultFocus>,
    [homePageDetails]
  );

  const movieData = movieDetail?.movieData || {};

  return (
      <Page>
     {homePageDetails ? (
        movieData ? (
         <HomeMovieBackdrop>
           {/* <Box style={{backgroundColor:'transparent'}}> */}
             <MovieTitle hideView={getPlatformType() === platformType.mobile} />
            <MovieGenres hideView={getPlatformType() === platformType.mobile} />
            <MovieOverview
              hideView={getPlatformType() === platformType.mobile}
            />
            <MoviePlayButton
              hideView={getPlatformType() === platformType.mobile}
              onPress={()=>setisPopupVisible(true)}
            />
           {getPlatformType() === platformType.mobile && <UserInfo />}
            {renderMovieRow}
            {/* </Box> */}
          </HomeMovieBackdrop>
        ) : null
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: black,
          }}>
          <Text style={{color:'white', fontSize:normalize(1.5)}}>Loading..</Text>
        </View>
      )}  
    {  Platform.OS==='web' && <AwesomeAlert
          show={isPopupVisible}
          showProgress={false}
          title="Alert"
          message="This action requires you to log in first. Would you like to log in now?"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="cancel"
          confirmText="Ok"
          confirmButtonColor="#111"
          onCancelPressed={() => {
           setisPopupVisible(false);
          }}
          onConfirmPressed={() => {
            setisPopupVisible(false);
            navigation.navigate('SignIn');
          }}
          contentContainerStyle={{
            // flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            // backgroundColor: black,
          }}
        />}
      </Page>
  );
}

const styles = StyleSheet.create({
  topArrowContainer: {
    width: '100%',
    height: 100,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 20,
    left: 0,
  },
  bottomArrowContainer: {
    width: '100%',
    height: 100,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: -15,
    left: 0,
  },
});


export default React.memo(MovieScreen);
