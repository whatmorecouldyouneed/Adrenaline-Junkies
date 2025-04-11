// App.js
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import the type definition
import { RootStackParamList } from '../types/navigation'; // Adjusted path

// Import Screens
import ChoiceScreen from './screens/ChoiceScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import CharacterCreator from './screens/CharacterCreator';
import LoreScreen from './screens/LoreScreen';
import ResultsScreen from './screens/ResultsScreen';
// MainMenu placeholder
const MainMenuScreen = ({ navigation }: any) => ( <View style={styles.placeholderContainer}><Text style={styles.placeholderText}>Main Menu</Text><TouchableOpacity onPress={() => navigation.replace('Choice')} style={{marginTop: 20}}><Text style={styles.placeholderButtonText}>Logout (Go to Choice)</Text></TouchableOpacity></View> );


const Stack = createNativeStackNavigator<RootStackParamList>();
SplashScreen.preventAutoHideAsync();

export default function App() {
   const [fontsLoaded, fontError] = useFonts({ '8bit': require('../assets/fonts/PressStart2P-Regular.ttf') });
   useEffect(() => { if (fontsLoaded || fontError) { SplashScreen.hideAsync(); } }, [fontsLoaded, fontError]);
   useEffect(() => { if (fontError) { console.error('Font loading error:', fontError); } }, [fontError]);
   if (!fontsLoaded && !fontError) { return null; }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Choice"
        screenOptions={{
            headerShown: false,
            animation: 'fade',
        }}
      >
        {/* Define Screens - Removed comments */}
        <Stack.Screen name="Choice" component={ChoiceScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="CharacterCreator" component={CharacterCreator} />
        <Stack.Screen name="Lore" component={LoreScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="MainMenu" component={MainMenuScreen} />
        {/* Ensure no stray text or characters are here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles for the placeholder screen
const styles = StyleSheet.create({
   placeholderContainer: { flex: 1, backgroundColor: '#010326', alignItems: 'center', justifyContent: 'center', padding: 20 },
   placeholderText: { color: '#EAF205', fontSize: 24, textAlign: 'center', margin: 10, fontFamily: '8bit' },
   placeholderButtonText: { color: 'cyan', fontFamily: '8bit', fontSize: 16, padding: 10, textAlign: 'center' }
});