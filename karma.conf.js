const path = require('path');
const sass = require('sass');

const webpack = {
  mode: 'production',
  resolve: {
    modules: [
      path.resolve('', './packages'),
      path.resolve('', './node_modules'),
    ],
    extensions: ['.js', '.jsx'],
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
            loader: 'sass-loader',
            options: {
              implementation: sass,
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
              '@babel/plugin-proposal-class-properties',
            ],
          },
        },
      },
    ],
  },
};

module.exports = function configure(config) {
  config.set({
    basePath: '',
    files: [
      { pattern: '__test__/**/*.test.js*', watched: true },
    ],
    preprocessors: {
      '__test__/**/*.test.js*': ['webpack'],
    },
    webpack,
    frameworks: ['mocha'],
    autoWatch: false,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu',
          '--remote-debugging-port=9222',
        ],
      },
    },
  });
};
