const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const createConfig = require('./createConfig');

const startOrEndWithList = [
  'classnames',
  'json-schema-traverse',
  'lodash',
  'prop-types',
  'react',
  'react-dnd',
  'react-dnd-html5-backend',
  'react-dom',
  'react-frame-component',
  'uuid',
  'react-mc-dnd',
  'react-mc-dnd-frame',
  'react-mc-render',
  'react-mc-template',
];

module.exports = (...args) => {
  const config = createConfig(...args);

  const externals = [
    (context, request, callback) => {
      const startedOrEnded = startOrEndWithList.some((item = '') => {
        const started = request.startsWith(`${item}/`) || request.startsWith(`~${item}/`);
        const ended = request.endsWith(item) || request.endsWith(`~${item}`);

        return started || ended;
      });

      if (startedOrEnded) {
        return callback(null, `commonjs ${request}`);
      }

      callback();
    },
  ];

  config.externals = config.externals || [];
  config.externals = config.externals.concat(externals);

  config.plugins = config.plugins || [];
  // config.plugins = config.plugins.concat(new BundleAnalyzerPlugin({
  //   analyzerMode: 'static',
  //   generateStatsFile: true,
  // }));

  return config;
};
