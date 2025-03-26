import {Platform, StyleSheet} from 'react-native';

export default function CreateResponsiveStyle(
  webStyles,
  tvStyles,
  mobileStyles,
) {
  const web = StyleSheet.create(webStyles);
  const tv = StyleSheet.create(tvStyles);
  const mobile = StyleSheet.create(mobileStyles);

  return Platform.OS === 'web' ? web : Platform.isTV ? tv : mobile;
}
