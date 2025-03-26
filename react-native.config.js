// eslint-disable-next-line no-undef
// module.exports = {
//     assets: ['./src/assets/fonts/']
// };


module.exports = {
	assets: ['./src/assets/fonts/'],
  dependencies: {
    "react-native-video": {
      platforms: {
        android: {
          sourceDir: "../node_modules/react-native-video/android-exoplayer",
        },
      },
    },
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
  },
};