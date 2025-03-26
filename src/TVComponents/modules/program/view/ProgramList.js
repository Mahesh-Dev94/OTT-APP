import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback } from 'react';
import { SpatialNavigationVirtualizedList } from 'react-tv-space-navigation';
import { scaledPixels } from '../../../design-system/helpers/scaledPixels';
import { Dimensions, View } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { ProgramNode } from './ProgramNode';
import alert from  '../../../../component/Utils/alert'; 
const { width } = Dimensions.get("window");

const NUMBER_OF_ITEMS_VISIBLE_ON_SCREEN = 7;
const WINDOW_SIZE = NUMBER_OF_ITEMS_VISIBLE_ON_SCREEN + 8;
const ROW_PADDING = scaledPixels(50);

export const ProgramList = ({
  orientation,
  containerStyle,
  data,
  title
}) => {
  const route = useRoute().name;
  const navigation = useNavigation();
  const session = useSelector((state) => state.hasSession.hasSession);
  let newData = [...data, { id: '', mediaUuid: '122' }, { id: '', mediaUuid: '122' }, { id: '', mediaUuid: '122' }, { id: '', mediaUuid: '122' }, { id: '', mediaUuid: '122' }, { id: '', mediaUuid: '122' }, { id: '', mediaUuid: '122' }];

  const ShowAlert = () => {
    alert(
      'Alert',
      'This action requires you to log in first. Would you like to log in now?',
      [
        { text: 'No', onPress: () => console.log('OK Pressed') },
        { text: 'Yes', onPress: () => navigation.navigate('SignIn') },
      ],
      { cancelable: false },
    );
  }

  const _onSelect = (item) => {
    const isLive = item.mediaUuid ? false : true;
    console.log('onslect called--',session)
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

  const renderItem = useCallback(
    ({ item }) => {
      if (item.id === '') {
        return null;
      } else {
        return (
          <ProgramNode
            programInfo={item}
            onSelect={() => _onSelect(item)}
          />
        );
      }
    },
    [navigation],
  );

  const theme = useTheme();

  return (
    <Container style={containerStyle}>
      <SpatialNavigationVirtualizedList
        orientation={orientation}
        data={newData}
        renderItem={renderItem}
        itemSize={theme.sizes.program.portrait.width + 30}
        numberOfRenderedItems={newData.length + 2}
        numberOfItemsVisibleOnScreen={newData.length <= 5 ? newData.length : 5}
      />
    </Container>
  );
};

export const ProgramsRow = ({ containerStyle, data, title }) => {
  const theme = useTheme();
  return (
    <ProgramList
      containerStyle={{
        ...containerStyle,
        height: theme.sizes.program.portrait.height + ROW_PADDING,
      }}
      data={data}
      title={title}
    />
  );
};

const Container = styled.View(({ theme }) => ({
  borderRadius: scaledPixels(20),
  overflow: 'hidden',
}));
