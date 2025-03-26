import React, {forwardRef} from 'react';
import {View, Platform, ScrollView, StyleSheet} from 'react-native';
import {
  DefaultFocus,
  SpatialNavigationScrollView,
} from 'react-tv-space-navigation';
import {
  BottomArrow,
  TopArrow,
} from '../../../src1/design-system/components/Arrows';

const ScrollContainer = ({children, style}) => {
  // const scrollViewRef = React.useRef();

  // if (Platform.OS === 'web') {
  //   return <ScrollView>{children}</ScrollView>;
  // }
  // if (Platform.isTV ) {
  //   if (Platform.OS === 'android') {
  //     React.useImperativeHandle(ref, () => ({
  //       scrollTo: scrollY => {
  //         if (scrollViewRef.current) {
  //           scrollViewRef.current.scrollTo({y: scrollY, animated: true});
  //         }
  //       },
  //     }));
  //     return (
  //       <ScrollView
  //         scrollEnabled={false}
  //         style={{paddingTop: 10, marginHorizontal: 5}}
  //         ref={scrollViewRef}>
  //         {children}
  //       </ScrollView>
  //     );
  //   } else {
  //     return (
  //       <ScrollView  style={{padding: 10}}>
  //         {children}
  //       </ScrollView>
  //     );
  //   }
  // }

  if (Platform.isTV) {
    return (
      // <DefaultFocus>
      // <SpatialNavigationScrollView style={style} offsetFromStart={140}>
      // {children}
      // </SpatialNavigationScrollView>
      // </DefaultFocus>
      <DefaultFocus>
        <SpatialNavigationScrollView
          offsetFromStart={110}
          ascendingArrow={<BottomArrow />}
          ascendingArrowContainerStyle={styles.bottomArrowContainer}
          descendingArrow={<TopArrow />}
          descendingArrowContainerStyle={styles.topArrowContainer}>
          {children}
        </SpatialNavigationScrollView>
      </DefaultFocus>
    );
  } else if (Platform.OS === 'web') {
    return children;
  }

  return <View>{children}</View>;
};

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
export default React.memo(ScrollContainer);
