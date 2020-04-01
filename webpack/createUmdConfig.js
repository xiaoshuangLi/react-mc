const createConfig = require('./createConfig');

const externals = [];

module.exports = (...args) => {
  const config = createConfig(...args);

  config.externals = config.externals || [];
  config.externals = config.externals.concat(externals);
  config.plugins = config.plugins || [];
  config.output.filename = 'index.umd.js';

  return config;
};
