const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (opts = {}) => {
  const {
    folder = '',
    filename = 'index.js',
    library = {},
  } = opts;

  return {
    context: folder,
    mode: 'production',
    entry: {
      main: [
        path.resolve(folder, 'index.js'),
      ],
    },
    output: {
      library,
      filename,
      path: path.resolve(folder, 'lib'),
      publicPath: '/',
      libraryTarget: 'umd',
    },
    resolve: {
      modules: [
        'node_modules',
      ],
      alias: {
        shared: path.resolve(__dirname, '../packages/shared'),
      },
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
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: path.resolve(__dirname, '../postcss-config.js'),
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
              ],
              plugins: [
                'react-hot-loader/babel',
                '@babel/plugin-proposal-class-properties',
              ],
            },
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
    ],
  };
};
