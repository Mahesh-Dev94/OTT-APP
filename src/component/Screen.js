import React from 'react';
import PropTypes from 'prop-types';
import {
  StatusBar,
  View,
  SafeAreaView,
  Platform,
  StyleSheet,
} from 'react-native';
import {black} from '../helper/Color';

const Container = ({children}) => {
  if (Platform.isTV) {
    return <View style={_styles.container}>{children}</View>;
  } else {
    return <SafeAreaView style={_styles.container}>{children}</SafeAreaView>;
  }
};

const Screen = ({children}) => {
  return (
    <View style={{flex: 1, backgroundColor: black}}>
      <Container>
        <StatusBar barStyle="light-content" translucent />
        {children}
      </Container>
    </View>
  );
};

export default Screen;

Screen.propTypes = {
  children: PropTypes.any.isRequired,
};

const _styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: black,
  },
});
