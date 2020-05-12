const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const basePath = path.resolve(__dirname, './');

module.exports = {
  mode: 'development',
  entry: {
    app: path.resolve(basePath, 'src/index.js'),
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(basePath, 'dist'),
    host: '0.0.0.0',
    hot: true,
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(basePath, 'dist'),
    publicPath: '/',
  },
  resolve: {
    alias: {
      'react-dom': path.resolve(basePath, '../node_modules/@hot-loader/react-dom'),
    },
    modules: [
      path.resolve(basePath, 'src'),
      path.resolve(basePath, '../packages'),
      path.resolve(basePath, '../node_modules'),
    ],
    extensions: ['.js', '.jsx', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 2 },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.resolve(basePath, '../postcss-config.js'),
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
            },
          },
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
              [
                'react-docgen',
                {
                  handlers: [
                    path.resolve(basePath, '../node_modules/react-docgen-props-schema/handlers/propDocHandler.js'),
                    path.resolve(basePath, '../node_modules/react-docgen-props-schema/handlers/schemaHandler.js'),
                  ],
                },
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(basePath, 'views/index.html'),
      filename: 'index.html',
    }),
  ],
};
