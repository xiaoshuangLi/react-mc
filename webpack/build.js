const path = require('path');
const webpack = require('webpack');

const createPrdConfig = require('./createPrdConfig.js');
const createUmdConfig = require('./createUmdConfig.js');

const packages = [
  'react-mc-dnd',
  'react-mc-dnd-frame',
  'react-mc-render',
  'react-mc-runner',
  'react-mc-template',
  'react-mc-diagrams',
];

const convert = (str = '') => {
  const parts = str.split('-').map((item = '') => {
    const [first = '', ...rest] = item;

    return [first.toUpperCase(), ...rest].join('');
  });

  return parts.join('');
};

const list = packages.map((packageName = '') => {
  const folder = path.resolve(__dirname, `../packages/${packageName}`);
  const library = {
    root: 'ReactBabyForm',
    amd: 'ReactBabyForm',
    commonjs: packageName,
  };

  return createPrdConfig({ folder, library });
});

webpack(list, (err, stats) => {
  const str = stats.toString();
  process.stdout.write(`${str} \n`);
});
