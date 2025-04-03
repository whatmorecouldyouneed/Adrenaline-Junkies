// App.js
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/env'; // or './navigation'

import { useEffect } from 'react';

// Import the combined AuthScreen
import AuthScreen from './screens/SignupScreen';
import CharacterCreator from './screens/CharacterCreator';
import SignupScreen from './screens/SignupScreen';
import LoreScreen from './screens/LoreScreen';
import ResultsScreen from './screens/ResultsScreen';
// Import other screens you navigate to after login, e.g., HomeScreen
// import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ // Also catch font errors
    '8bit': require('../assets/fonts/PressStart2P-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) { // Hide splash screen if fonts loaded or if there was an error
        SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Optional: Log font errors
  useEffect(() => {
    if (fontError) {
      console.error('Font loading error:', fontError);
    }
  }, [fontError]);


  if (!fontsLoaded && !fontError) { // Still loading fonts
    return null; // Or return a basic loading indicator
  }

  // If fonts failed to load but we hid the splash screen, render the app anyway
  // or show an error message. For now, we proceed.

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Signup"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="CharacterCreator" component={CharacterCreator} />
        <Stack.Screen name="Lore" component={LoreScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        {/* Add game levels below once Unreal Engine launches are wired */}
        {/* <Stack.Screen name="LevelOne" component={UnrealEngineLevelOne} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}