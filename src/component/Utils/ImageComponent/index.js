import React from 'react';
import FastImage from 'react-native-fast-image';

const Images = ({source, resizeMode, style, ...props}) => {
  // console.log('source---',source)
  return (
    <FastImage
      source={{
        ...source,
        priority: FastImage.priority.high,
        headers: {
          'Cache-Control': 'max-age=3600',
        },
      }}
      resizeMode={resizeMode}
      style={[style, {backgroundColor: '#1B1212'}]}
      {...props}
    />
  );
};

export default Images;
