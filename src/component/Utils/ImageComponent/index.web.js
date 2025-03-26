import React from 'react';
import {Image } from 'react-native';
// import Image from 'react-native';

const Images = ({ source, resizeMode, style, ...props }) => {
  return (
    <Image
      source={source}
      resizeMode={resizeMode}
      style={style}
      {...props}
    />
  );
};

export default Images;