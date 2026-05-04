const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add resolution for react-dom which is required by some universal dependencies of Gluestack UI
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-dom': require.resolve('react-dom'),
};

module.exports = config;
