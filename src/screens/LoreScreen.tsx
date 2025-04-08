// screens/LoreScreen.js (Fixed Animatable Import)
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TypeWriter from 'react-native-typewriter';
import { useNavigation } from '@react-navigation/native';
// Import BOTH get functions from playerStorage
import { getPlayerDataLocal } from '../utils/playerStorage'; // Adjust path if needed
import { LEVELS } from '../constants/levels'; // Adjust path if needed
// --- ADD THIS IMPORT ---
import * as Animatable from 'react-native-animatable';
// --- END ADD IMPORT ---
// Import navigation types if needed
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import type { RootStackParamList } from '../App'; // Adjust path if needed

export default function LoreScreen({ route }: any) {
  // Ensure route and route.params exist before destructuring
  const loreId = route?.params?.loreId;
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);
  const nav = useNavigation(); // Add typing if needed: useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  useEffect(() => {
    if (!loreId) {
      console.error("LoreScreen: No loreId provided in route params!");
      setText("Error: Lore ID missing.");
      setDone(true); // Allow continuing or show error state
      return;
  }
    const load = async () => {
      console.log(`LoreScreen: Loading lore for ID: ${loreId}`);
      try {
          // Fetch the whole player data object locally
          const playerData = await getPlayerDataLocal();
          const name = playerData?.name || 'Adventurer'; // Use defaults if data is null/missing
          const hometown = playerData?.hometown || 'a quiet village';
          console.log(`LoreScreen: Using name: "${name}", hometown: "${hometown}"`);

          const level = LEVELS.find((lvl) => lvl.id === loreId);

          if (level) {
            if (typeof level.lore === 'function') {
                // Call lore function with name and hometown from local data
                const loreText = level.lore(name, hometown);
                console.log(`LoreScreen: Generated lore text: "${loreText}"`);
                setText(loreText);
            } else { /* ... error handling ... */ }
          } else { /* ... error handling ... */ }
      } catch (error) { /* ... error handling ... */ }
    };

    load();
    setDone(false);
    setText('');

  }, [loreId]); // Dependency array includes loreId

  const handleContinue = async () => {
    // Ensure loreId is valid before finding level
    if (!loreId) return;
    const level = LEVELS.find((lvl) => lvl.id === loreId);
    // Use optional chaining and check if nextScreen exists
    if (level?.nextScreen) {
        console.log(`LoreScreen: Navigating to next screen: ${level.nextScreen}`);
        nav.navigate(level.nextScreen as never); // Navigate using the defined next screen
    } else {
        console.warn(`LoreScreen: No nextScreen defined for loreId: ${loreId}`);
        // Optionally navigate back or to a default screen
        // nav.goBack();
    }
  };

  // --- Render Logic ---
  return (
    <View style={styles.container}>
      {/* Only render TypeWriter if text is loaded */}
      {text ? (
        <TypeWriter
          typing={1}
          maxDelay={70}
          minDelay={20}
          onTypingEnd={() => { console.log("Typewriter finished."); setDone(true); }}
          style={styles.text}
          // Add a key to force re-mount when text changes, ensuring typewriter restarts
          key={loreId}
        >
          {text}
        </TypeWriter>
      ) : (
        // Optional: Show a loading indicator while text is empty
        <Text style={styles.text}>Loading story...</Text>
      )}


      {/* Render continue button only when typing is done */}
      {done && (
        // Use the imported Animatable
        <Animatable.View animation="fadeInUp" duration={500}>
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>continue</Text>
            </TouchableOpacity>
        </Animatable.View>
      )}
    </View>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#010326',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: '#EAF205',
    fontSize: 16,
    fontFamily: '8bit',
    textAlign: 'center',
    lineHeight: 28,
    minHeight: 50, // Give it some min height
  },
  button: {
    marginTop: 40,
    padding: 20,
    borderRadius: 5,
    backgroundColor: '#EAF205',
  },
  buttonText: {
    fontFamily: '8bit',
    color: '#010326',
    fontSize: 14,
    textTransform: 'lowercase',
  },
});
