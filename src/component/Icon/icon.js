import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

export const ImageIcon = ({name, size, style, color,solid}) => {
  return <Icon name={name} size={size} style={style} color={color} solid={solid?true:false} />;
};
