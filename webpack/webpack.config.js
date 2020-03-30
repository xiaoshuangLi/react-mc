const path = require('path');
const projectFolder = path.resolve(__dirname, '../');

module.exports = {
  context: projectFolder,
  devtool: 'source-map',
  mode: 'production',
  performance: {
    hints: false,
  },
  entry: {
    main: [
      path.resolve(projectFolder, 'packages/react-mc-template/index.js'),
      path.resolve(projectFolder, 'packages/react-mc-render/index.js'),
    ],
  },
  // output: {
  //   path: path.resolve(projectFolder, 'lib'),
  //   publicPath: '/',
  //   filename: 'index.js',
  //   library: {
  //     root: 'ReactBabyForm',
  //     amd: 'ReactBabyForm',
  //     commonjs: 'react-baby-form',
  //   },
  //   libraryTarget: 'umd',
  // },
  resolve: {
    modules: [
      'packages',
      'node_modules',
    ],
    extensions: ['.js', '.jsx', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
};
