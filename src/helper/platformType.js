import {Platform} from 'react-native';

export const platformType = {
  tv: 'TV',
  mobile: 'mobile',
  web: 'web',
};

export function getPlatformType() {
  if (Platform.isTV) return platformType.tv;
  if (Platform.OS === 'web') return platformType.web;
  return platformType.mobile;
}
