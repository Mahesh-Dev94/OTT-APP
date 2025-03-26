const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname);
const {presets} = require(`${appDirectory}/babel.config.js`);

const compileNodeModules = [
  'react-native-vector-icons',
  'react-native-vector-icons/FontAwesome5',
  'react-native-status-bar-height',
  '@react-navigation/native',
  '@react-navigation/stack',
  'react-native-animatable',
  'react-native-image-zoom-viewer',
  'react-native-linear-gradient',
  'react-native-image-pan-zoom',
  'react-native-video',
  'react-native-image-colors',
  'react-native-paper',
  'react-native-actions-sheet',
  'shaka-player',
  'react-native-tv-selected-focus',
  'react-native-reanimated-carousel',
  'react-native-reanimated',
  // 'react-native-fs',
  'm3u8-file-parser',
  'react-native-orientation-locker',
  'react-native-volume-manager',
  'react-native-snap-carousel',
  'react-tv-space-navigation',
  '@emotion/native',
  'mitt',
  'aws-amplify',
  '@aws-amplify/rtn-web-browser',
  '@aws-amplify/react-native',
  'ts-loader',
  'react-native-image-picker',
  'react-native-progress',
  'react-native-date-picker',
  '@react-navigation/drawer',
  'react-native-awesome-alerts'
  // 'react-native-simple-toast'


].map(moduleName => path.resolve(appDirectory, `node_modules/${moduleName}`));

const babelLoaderConfiguration = {
  // test: /\.js$|css$|jsx$|tsx?$/,
  test: /\.(js|jsx|ts|tsx)$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(__dirname, 'index.web.js'), // Entry to your application
    // path.resolve(__dirname, 'App.web.js'), // Change this to your main App file
    path.resolve(__dirname, 'App.js'),
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'videoTest.js'),
    ...compileNodeModules,
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets,
      plugins: ['react-native-web'],
    },
  },
};

const svgLoaderConfiguration = {
  test: /\.svg$/,
  use: [
    {
      loader: '@svgr/webpack',
    },
  ],
};

const vttLoader = {
  test: /\.vtt$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
    },
  },
};
const mp4Loaders = {
  test: /\.mp4$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
    },
  },
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      esModule: false,
    },
  },
};


const cssLoader = {
  test: /\.css$/i,
  use: ['style-loader', 'css-loader', 'less-loader'],
};

const ttfLoaderConfiguration = {
  test: /\.ttf$/,
  loader: 'url-loader', // or directly file-loader
  include: path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
};

const fontLoader = {
  test: /\.ttf$/,
  loader: 'file-loader', // or directly file-loader
  include: [
    path.resolve(__dirname, 'src/assets/fonts/Montserrat-Bold'),
    path.resolve(__dirname, 'src/assets/fonts/Montserrat-Light'), // Entry to your application
    path.resolve(__dirname, 'src/assets/fonts/Montserrat-Medium'), // Change this to your main App file
    path.resolve(__dirname, 'src/assets/fonts/Montserrat-Regular'),
    path.resolve(__dirname, 'src/assets/fonts/Montserrat-SemiBold'),
  ],
};

// Add the ts-loader for TypeScript files
const tsLoaderConfiguration = {
  test: /\.(ts|tsx)$/,
  use: 'ts-loader',
  include: [
    path.resolve(__dirname, 'index.web.js'),
    path.resolve(__dirname, 'App.tsx'),
    // Add more paths if needed
  ],
};

// const sourceLoad = {test: /\.js$/, enforce: 'pre', use: ['source-map-loader']};

module.exports = {
  entry: {
    app: path.join(__dirname, 'index.web.js'),
  },
  output: {
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/',
    filename: 'rnw_blogpost.bundle.js',
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],     // ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native-linear-gradient': 'react-native-web-linear-gradient',
    },
  },
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      svgLoaderConfiguration,
      cssLoader,
      fontLoader,
      ttfLoaderConfiguration,
      vttLoader,
      mp4Loaders,
      tsLoaderConfiguration

      // sourceLoad
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      // See: https://github.com/necolas/react-native-web/issues/349
      __DEV__: JSON.stringify(true),
    }),
    new webpack.EnvironmentPlugin({JEST_WORKER_ID: null}),
    // new webpack.DefinePlugin({ process: { env: {} } })
  ],
};
