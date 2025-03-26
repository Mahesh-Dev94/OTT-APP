import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = ({ size = 'large', color = '#fff' }) => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:'transparent',      //'#00000055', // semi-transparent white background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:999
  },
});

export default Loader;