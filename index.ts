import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';
if (typeof (global as any).localStorage === 'undefined') {
  (global as any).localStorage = AsyncStorage;
}
(global as any).Buffer = Buffer;

import { registerRootComponent } from 'expo';

import App from './src/App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
