// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

// initialize configuration
const config = getDefaultConfig(__dirname);
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.sourceExts = [...(config.resolver.sourceExts || []), 'cjs', 'mjs'];
config.resolver.assetExts = [...(config.resolver.assetExts || []), 'glb', 'gltf', 'fbx'];

module.exports = config;