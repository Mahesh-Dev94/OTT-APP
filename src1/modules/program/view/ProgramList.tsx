import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MutableRefObject, useCallback, useEffect, useMemo, useState } from 'react';
import {
  SpatialNavigationNode,
  SpatialNavigationVirtualizedList,
  SpatialNavigationVirtualizedListRef,
} from 'react-tv-space-navigation';
import { RootStackParamList } from '../../../../App';
import { ProgramInfo } from '../domain/programInfo';
import { getPrograms } from '../infra/programInfos';
import { ProgramNode } from './ProgramNode';
import { scaledPixels } from '../../../design-system/helpers/scaledPixels';
import { LeftArrow, RightArrow } from '../../../design-system/components/Arrows';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';
import { theme } from '../../../design-system/theme/theme';
import React from 'react';
import { useSelector } from 'react-redux';
import alert from '../../../../src/component/Utils/alert';   //'component/Utils/alert';
import { Platform } from 'react-native';
import { setSelectedDetailHome } from '../../../../redux/reducers/movieSwimlane';
import { useDispatch } from 'react-redux';

const NUMBER_OF_ITEMS_VISIBLE_ON_SCREEN = 7;
const WINDOW_SIZE = NUMBER_OF_ITEMS_VISIBLE_ON_SCREEN + 8;
const ROW_PADDING = scaledPixels(70);

export const ProgramList = ({
  orientation,
  containerStyle,
  listRef,
  data,
  title
}: {
  orientation?: 'vertical' | 'horizontal';
  containerStyle?: object;
  listRef: MutableRefObject<SpatialNavigationVirtualizedListRef>;
  data:any,
  title:string
}) => {
  const session =useSelector((state:any) => state.hasSession.hasSession);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  let newData = Platform.isTV ? [...data, { id: '', mediaUuid: '122' }, { id: '', mediaUuid: '122' }, { id: '', mediaUuid: '122' }, { id: '', mediaUuid: '122' }, { id: '', mediaUuid: '122' }, { id: '', mediaUuid: '122' }, { id: '', mediaUuid: '122' }]:data;
  const ShowAlert = () => {
    alert(
      'Alert',
      'This action requires you to log in first. Would you like to log in now?',
      [
        { text: 'cancel', onPress: () => console.log('OK Pressed') },
        { text: 'Yes', onPress: () => navigation.navigate('SignIn') },
      ],
      { cancelable: false },
    );
  }


  const _onSelect =(item: { id: any; title?: string; image?: ImageSourcePropType; description?: string; mediaUuid?: any; mediaUrl?: any }) => {
      const isLive = item.mediaUuid ? false : true;
      console.log('##### onSelect called --', session);
      if (title === 'Recommendations') {
        navigation.push('MovieDetail', { id: item.id });
      } else if (isLive) {
        if (session) {
          navigation.navigate('Player', {
            isLive: isLive,
            url: item.mediaUrl,
            liveData: item,
          });
        } else {
          ShowAlert();
        }
      } else {
          navigation.navigate('MovieDetail', {
            id: item.id,
          });
      }
    }

    const dispatch = useDispatch();
  const _onFocus=(item:any)=>{
    dispatch(setSelectedDetailHome(item));
  }

  const renderItem =
    ({ item }: { item: any }) =>  {
      if (item.id === '') {
        return <></>   //<View />;
      } else {
        return (
      <ProgramNode
        programInfo={item}
        onSelect={() => _onSelect(item)}
        onFocus={()=>_onFocus(item)}
      />
      );
    }
  }
  const theme = useTheme();

  // const programInfos = useMemo(() => getPrograms(1000), []);

  return (
    <SpatialNavigationNode>
      {({ isActive }) => (
        <Container isActive={isActive} style={containerStyle}>
          <SpatialNavigationVirtualizedList
            orientation={orientation}
            data={newData}
            renderItem={renderItem}
            itemSize={theme.sizes.program.portrait.width + 30}
            // numberOfRenderedItems={WINDOW_SIZE}
            // numberOfItemsVisibleOnScreen={NUMBER_OF_ITEMS_VISIBLE_ON_SCREEN}
            numberOfRenderedItems={newData.length + 2}
            numberOfItemsVisibleOnScreen={newData.length <= 5 ? newData.length : 5}
            onEndReachedThresholdItemsNumber={newData.length <= 5 ? newData.length : 5}
            descendingArrow={isActive ? <LeftArrow /> : <View />}
            descendingArrowContainerStyle={styles.leftArrowContainer}
            ascendingArrow={isActive ? <RightArrow /> : <View />}
            ascendingArrowContainerStyle={styles.rightArrowContainer}
            ref={listRef}
          />
        </Container>
      )}
    </SpatialNavigationNode>
  );
};

export const ProgramsRow = ({
  containerStyle,
  listRef,
  data,
  title
}: {
  containerStyle?: object;
  listRef: MutableRefObject<SpatialNavigationVirtualizedListRef>;
  data:[],
  title:string
}) => {
  const theme = useTheme();
  return (
    <ProgramList
      containerStyle={{
        ...containerStyle,
        height:title==='Live'?theme.sizes.program.portrait.height-10: theme.sizes.program.portrait.height + ROW_PADDING,
        // backgroundColor: title==='Live'?'red':'white'
        paddingBottom:100
      }}
      listRef={listRef}
      data={data}
      title={title}
    />
  );
};

const Container = styled.View<{ isActive: boolean }>(({ isActive, theme }) => ({
  // backgroundColor: isActive
  //   ? theme.colors.background.mainActive
  //   : theme.colors.background.mainHover,
  padding: theme.spacings.$5,
  borderRadius: scaledPixels(20),
  // overflow: 'hidden',
}));

const styles = StyleSheet.create({
  leftArrowContainer: {
    width: 120,
    height: scaledPixels(260) + 2 * theme.spacings.$8,
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    left: -theme.spacings.$8,
  },
  rightArrowContainer: {
    width: 120,
    height: scaledPixels(260) + 2 * theme.spacings.$8,
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    right: -theme.spacings.$8,
  },
});
