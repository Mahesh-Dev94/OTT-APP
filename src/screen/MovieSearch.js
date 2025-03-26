// import { useTheme } from '@emotion/react';
// import { useCallback, useEffect, useState } from 'react';
// import { FlatList, Platform, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
// import { DefaultFocus, SpatialNavigationVirtualizedGrid } from 'react-tv-space-navigation';
// import { ProgramNode } from '../../src1/modules/program/view/ProgramNode';    //'../TVComponents/modules/program/view/ProgramNode';
// import { scaledPixels } from '../../src1/design-system/helpers/scaledPixels';    //'../TVComponents/design-system/helpers/scaledPixels';
// import { SearchTextInputs } from '../../src1/design-system/components/SearchInput'  //'../TVComponents/design-system/components/SearchInput';
// import { black, white } from '../helper/Color'
// // import { Page } from '../TVComponents/components/Page';
// import { useDispatch, useSelector } from 'react-redux';
// import { useIsFocused, useNavigation } from '@react-navigation/native';
// import { setroute } from '../../redux/reducers/routeName';
// import { SearchByFilter, SearchDefault } from '../api/api';
// import MobMoviePoster from '../component/MoviePoster'; 
// import { VirtualizedSpatialGrid } from '../../src1/components/VirtualizedSpatialGrid';
// import { Page } from '../../src1/components/Page';

// const NUMBER_OF_ROWS_VISIBLE_ON_SCREEN = 2;
// const NUMBER_OF_RENDERED_ROWS = NUMBER_OF_ROWS_VISIBLE_ON_SCREEN + 3;
// const NUMBER_OF_COLUMNS = 6;
// const INFINITE_SCROLL_ROW_THRESHOLD = 2;
// const HEADER_SIZE = scaledPixels(120);

// const SearchScreen = () => {
//   const dispatch = useDispatch();
//   const isFocused = useIsFocused();
//   const navigation = useNavigation();
//   const session = useSelector((state) => state.hasSession.hasSession);
//   const [gridData, setGridData] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   // TODO: correct SpatialNavigationVirtualizedGrid props types
//   const renderItem = useCallback(({ item }) =>
//     <View style={{ margin: 5, marginBottom: 10 }}>
//       <ProgramNode programInfo={item} onSelect={() => _onSelect(item)} />
//     </View>, []);

//   useEffect(() => {
//     if (isFocused) {
//       dispatch(setroute('Search'));
//     }
//   }, [isFocused]);

//   const _onSelect = (item) => {
//     navigation.navigate('MovieDetail', {
//       id: item.id,
//     });
//   }
//   const callback = async (result) => {
//     setGridData(result.searchMovieResponse)
//   }
  
//   useEffect(() => {
//     if (searchQuery.trim() !== '') {
//       console.log('SearchByFilter----------')
//       SearchByFilter(searchQuery, callback1);
//     } else {
//       // If search query is empty, reset gridData to default
//       console.log('SearchDefault----------')
//       SearchDefault(callback);
//     }
//   }, [searchQuery]);

//   callback1 = (response) => {
//     const responseData = response.hits?.hits || [];
//     const fil_data = responseData.map(item => item._source);
//     console.log(searchQuery, '----resulteee--', JSON.stringify(fil_data))

//     setGridData(fil_data);
//   }

//   const theme = useTheme();


//   const renderGridItemMob = useCallback(({ item }) =>
//     <MobMoviePoster
//       isLive={false}
//       call_from={'search'}
//       item={item}
//     />, []);


//   if (Platform.isTV || Platform.OS === 'web') {
//     return (
//       // <Page style={{ backgroundColor: '#111' }}>
//          <Page>
//       <DefaultFocus>
//         <View style={styles.container}>
//           {/* <View style={styles.searchContainer}>
//             <SearchTextInputs onChange={setSearchQuery}/>
//           </View> */}
//         {/* <VirtualizedSpatialGrid data={gridData} /> */}
//           <SpatialNavigationVirtualizedGrid
//             data={gridData}
//             header={
//               <View style={styles.searchContainer}>
//                 <DefaultFocus>
//                 <SearchTextInputs onChange={setSearchQuery} />
//                 </DefaultFocus>
//               </View>
//             }
//             headerSize={HEADER_SIZE}
//             renderItem={renderItem}
//             itemHeight={(theme.sizes.program.portrait.height * 1.1) + 20}
//             numberOfColumns={NUMBER_OF_COLUMNS}
//             numberOfRenderedRows={NUMBER_OF_RENDERED_ROWS}
//             numberOfRowsVisibleOnScreen={NUMBER_OF_ROWS_VISIBLE_ON_SCREEN}
//             onEndReachedThresholdRowsNumber={INFINITE_SCROLL_ROW_THRESHOLD}
//             rowContainerStyle={styles.rowStyle}
//             style={{ backgroundColor: '#111' }}
//           />

//           {!gridData.length && (
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 // backgroundColor: black,
//                 paddingTop:200
//               }}>
//               <Text style={{ color: 'white' }}>This Movie is available!</Text>
//             </View>
//           )}
//         </View>
//         </DefaultFocus>
//       </Page>
//     );
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#11111199' }}>
//       {gridData ?
//         <View style={styles.container}>
//           <View style={styles.searchContainerMob}>
//             <TextInput
//               // value={value}
//               onChangeText={setSearchQuery}
//               // onBlur={onBlur}
//               placeholder={'Search'}
//               placeholderTextColor={'gray'}
//               style={styles.searchInputMob}
//             />
//           </View>
//           <FlatList
//             data={gridData}
//             renderItem={renderGridItemMob}
//             keyExtractor={(item) => item.id}
//             numColumns={2}
//             contentContainerStyle={styles.grid}
//           />
//         </View>
//         : (
//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: black,
//             }}>
//             <Text style={{ color: 'white' }}>Loading..</Text>
//           </View>
//         )}
//     </SafeAreaView>
//   );

// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#111',
//     padding: scaledPixels(10),
//    paddingHorizontal:20
//   },
//   rowStyle: { gap: scaledPixels(15) },
//   searchContainer: {
//     flexDirection: 'row',
//     height: HEADER_SIZE,
//     backgroundColor: '#11111199',
//     zIndex: 999,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     alignContent: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 25,
//     width: '100%'
//   },
//   searchContainerMob: {
//     marginTop: 30,
//     height: 70,
//     backgroundColor: '#11111199',
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignContent: 'center',
//     paddingVertical: 5,
//     paddingHorizontal: 10,

//   },
//   searchInputMob: { width: '100%', borderColor: white, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, color: white }
// });

// export default SearchScreen;


import { useTheme } from '@emotion/react';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { FlatList, Platform, SafeAreaView, StyleSheet, Text, TextInput, View,Dimensions, ScrollView } from 'react-native';
import { DefaultFocus, SpatialNavigationScrollView, SpatialNavigationVirtualizedGrid } from 'react-tv-space-navigation';
import { ProgramNode } from '../../src1/modules/program/view/ProgramNode';    
import { scaledPixels } from '../../src1/design-system/helpers/scaledPixels';    
import { SearchTextInputs } from '../../src1/design-system/components/SearchInput';  
import { black, white } from '../helper/Color';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { setroute } from '../../redux/reducers/routeName';
import { SearchByFilter, SearchDefault } from '../api/api';
import MoviePoster from '../component/Home/HomeMoviePoster'    ////MoviePoster; 
import MobMoviePoster from '../component/MoviePoster'; 
import { VirtualizedSpatialGrid } from '../../src1/components/VirtualizedSpatialGrid';
import { Page } from '../../src1/components/Page';
import { debounce } from 'lodash';
import Loader from '../component/Loader';
import BackIcon from '../component/Utils/BackIcon';
const screen = Dimensions.get('window');

// Constants
const NUMBER_OF_ROWS_VISIBLE_ON_SCREEN = 2;
const NUMBER_OF_RENDERED_ROWS = NUMBER_OF_ROWS_VISIBLE_ON_SCREEN + 3;
const NUMBER_OF_COLUMNS = 6;
const INFINITE_SCROLL_ROW_THRESHOLD = 2;
const HEADER_SIZE = scaledPixels(120);

// Memoized ProgramNode
const MemoizedProgramNode = React.memo(({ item, onSelect }) => (
  <View style={{ margin: 5, marginBottom: 10 }}>
    <ProgramNode programInfo={item} onSelect={onSelect} />
  </View>
));

// Memoized MobMoviePoster
const MemoizedMobMoviePoster = React.memo(({ item }) => (
  <MobMoviePoster isLive={false} call_from={'search'} item={item} height={240} width={(screen.width/2)-30} />
));

// Memoized MobMoviePoster
const MemoizedTVOSMoviePoster = React.memo(({ item }) => (
  <MoviePoster isLive={false} call_from={'search'} item={item} height={240} width={(screen.width/2)-30} />
));

const SearchScreen = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const session = useSelector((state) => state.hasSession.hasSession);
  const [gridData, setGridData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading,setIsLoading]=useState(false)
  const theme = useTheme();

  // Debounced search function
  const debouncedSearch = useMemo(() => debounce((query) => {
    if (query.length >= 1) {
      if (query.trim() !== '') {
        console.log('SearchByFilter----------');
        setIsLoading(true)
        SearchByFilter(query, callback1);
      } else {
        console.log('SearchDefault----------');
        setIsLoading(true)
        SearchDefault(callback);
      }
    } else if (query.length === 0) {
      // If search query is empty, reset gridData to default
      console.log('SearchDefault----------');
      setIsLoading(true)
      SearchDefault(callback);
    }
  }, 300), []);

  useEffect(() => {
    debouncedSearch(searchQuery);
    // Cancel debounce on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const renderItem = useCallback(({ item }) => (
    <MemoizedProgramNode item={item} onSelect={() => _onSelect(item)} />
  ), []);

  useEffect(() => {
    if (isFocused) {
      dispatch(setroute('Search'));
    }
  }, [isFocused]);

  const _onSelect = useCallback((item) => {
    navigation.navigate('MovieDetail', {
      id: item.id,
    });
  }, [navigation]);

  const callback = useCallback((result) => {
    setGridData(result.searchMovieResponse);
    setIsLoading(false);
  }, []);

  const callback1 = useCallback((response) => {
    const responseData = response.hits?.hits || [];
    const fil_data = responseData.map(item => item._source);
    console.log(searchQuery, '----resulteee--', JSON.stringify(fil_data));
    setGridData(fil_data);
    setIsLoading(false);
  }, [searchQuery]);

  const renderGridItemMob = useCallback(({ item }) => (
    <MemoizedMobMoviePoster item={item} />
  ), []);

  const renderGridItem_TVOS=useCallback(({ item })=>(
    <MemoizedTVOSMoviePoster item={item} />
  ))

  if (Platform.isTV) {
    return (
      <Page>
        <DefaultFocus>
          <View style={styles.container}>
          {isLoading && <Loader />}
          <View style={styles.searchContainer}>
                  <DefaultFocus>
                    <SearchTextInputs onChange={setSearchQuery} />
                  </DefaultFocus>
                </View>
            <SpatialNavigationVirtualizedGrid
              data={gridData}
              // header={
              //   <View style={styles.searchContainer}>
              //     <DefaultFocus>
              //       <SearchTextInputs onChange={setSearchQuery} />
              //     </DefaultFocus>
              //   </View>
              // }
              // headerSize={HEADER_SIZE}
              renderItem={renderItem}
              itemHeight={(theme.sizes.program.portrait.height * 1.1) + 20}
              numberOfColumns={NUMBER_OF_COLUMNS}
              numberOfRenderedRows={NUMBER_OF_RENDERED_ROWS}
              numberOfRowsVisibleOnScreen={NUMBER_OF_ROWS_VISIBLE_ON_SCREEN}
              onEndReachedThresholdRowsNumber={INFINITE_SCROLL_ROW_THRESHOLD}
              rowContainerStyle={styles.rowStyle}
              style={{ backgroundColor: '#111' }}
            />
            {!gridData.length && (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 200 }}>
                <Text style={{ color: 'white' }}>This Movie is not available!</Text>
              </View>
            )}
          </View>
        </DefaultFocus>
      </Page>
    );
  }
  // else if (Platform.isTV && Platform.OS==='ios') {
  //   return (
  //     <Page>
  //     <SafeAreaView style={{ flex: 1, backgroundColor: '#11111199' }}>
  //     {gridData ? (
  //       <View style={styles.container}>
  //         <View style={styles.searchContainerMob}>
  //         {Platform.isTV || Platform.OS === 'web' ? null : (
  //         <BackIcon
  //           navigation={navigation}
  //           style={styles.backContainer}
  //           touchStyle={styles.touchStyle}
  //           color={'white'}
  //         />
  //       )}
  //           <TextInput
  //             onChangeText={setSearchQuery}
  //             placeholder={'Search'}
  //             placeholderTextColor={'gray'}
  //             style={styles.searchInputMob}
  //           />
  //         </View>
  //         {isLoading && <Loader />}
  //         <FlatList
  //           data={gridData}
  //           renderItem={renderItem}   //{renderGridItem_TVOS}
  //           keyExtractor={(item) => item.id}
  //           numColumns={5}
  //           contentContainerStyle={styles.grid}
  //         />
  //       </View>
  //     ) : (
  //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: black }}>
  //         <Text style={{ color: 'white' }}>Loading..</Text>
  //       </View>
  //     )}
  //   </SafeAreaView>
  //   </Page>
  //   );
  // }
  else if(Platform.OS === 'web'){
    return (
      <Page>
        {/* <DefaultFocus> */}
        <View style={styles.searchContainer}>
                  <DefaultFocus>
                    <SearchTextInputs onChange={setSearchQuery} />
                  </DefaultFocus>
                </View>
          <ScrollView>
          <View style={styles.container}>
          {isLoading && <Loader />}
            <SpatialNavigationVirtualizedGrid
              data={gridData}
              // header={
              //   <View style={styles.searchContainer}>
              //     <DefaultFocus>
              //       <SearchTextInputs onChange={setSearchQuery} />
              //     </DefaultFocus>
              //   </View>
              // }
              // headerSize={HEADER_SIZE}
              renderItem={renderItem}
              itemHeight={(theme.sizes.program.portrait.height * 1.1) + 20}
              numberOfColumns={NUMBER_OF_COLUMNS}
              numberOfRenderedRows={NUMBER_OF_RENDERED_ROWS}
              numberOfRowsVisibleOnScreen={NUMBER_OF_ROWS_VISIBLE_ON_SCREEN}
              onEndReachedThresholdRowsNumber={INFINITE_SCROLL_ROW_THRESHOLD}
              rowContainerStyle={styles.rowStyle}
              style={{ backgroundColor: '#111' }}
            />
            {!gridData.length && (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 200 }}>
               {!isLoading && <Text style={{ color: 'white' }}>This Movie is available!</Text>}
              </View>
            )}
          </View>
          </ScrollView>
        {/* </DefaultFocus> */}
      </Page>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#11111199' }}>
      {gridData ? (
        <View style={styles.container}>
          <View style={styles.searchContainerMob}>
          {Platform.isTV || Platform.OS === 'web' ? null : (
          <BackIcon
            navigation={navigation}
            style={styles.backContainer}
            touchStyle={styles.touchStyle}
            color={'white'}
          />
        )}
            <TextInput
              onChangeText={setSearchQuery}
              placeholder={'Search'}
              placeholderTextColor={'gray'}
              style={styles.searchInputMob}
            />
          </View>
          {isLoading && <Loader />}
          <FlatList
            data={gridData}
            renderItem={renderGridItemMob}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.grid}
          />
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: black }}>
          <Text style={{ color: 'white' }}>Loading..</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    // padding: scaledPixels(10),
    paddingHorizontal: 10,
  },
  rowStyle: { gap: scaledPixels(15) },
  searchContainer: {
    flexDirection: 'row',
    height: HEADER_SIZE,
    backgroundColor: '#111111',
    zIndex: 999,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 25,
    width: '100%'
  },
  searchContainerMob: {
    marginTop: 20,
    marginHorizontal:10,
    height: 70,
    backgroundColor: '#11111199',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 5,
    // paddingHorizontal: 10,
    flexDirection:'row'
  },
  searchInputMob: { width: '90%',height:45, borderColor: white, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, color: white },
  backContainer: {
    height: 50,
    width: 50,
    borderRadius: 50,
    // position: 'absolute',
    // top: 35,
    // left: 10,
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

export default SearchScreen;







