// screens/CharacterCreator.js (Archetype, Speed, Firestore Save)
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { pixel } from '../styles/pixelStyles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';

// Import storage function for the whole object
import { savePlayerDataLocal } from '../utils/playerStorage';
// Import Firebase essentials
import { auth, db } from '../firebaseConfig'; // Import db (Firestore instance)
import { doc, setDoc, Timestamp } from "firebase/firestore"; // Import Firestore functions

// Define Archetypes
const ARCHETYPES = [
    "Explosive Sprinter", // Quick burst speed
    "Endurance Engine", // Consistent speed, less fatigue
    "Tactical Pacer",   // Starts slower, finishes strong
    "Raw Talent",       // Naturally gifted, less refined
];

export default function CharacterCreator() {
  const [name, setName] = useState('');
  const [hometown, setHometown] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [assignedSpeed, setAssignedSpeed] = useState(75); // Base speed, maybe adjust based on archetype later

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const currentUser = auth.currentUser; // Get current user (could be anonymous)

  // Effect to potentially pre-fill name if saved previously (e.g., from signup)
  // useEffect(() => {
  //   const loadName = async () => {
  //     const data = await getPlayerDataLocal();
  //     if (data?.name) {
  //       setName(data.name);
  //     }
  //   };
  //   loadName();
  // }, []);


  const handleCreateCharacter = async () => {
    const trimmedName = name.trim();
    const trimmedHometown = hometown.trim();
  
    if (!trimmedName || !trimmedHometown || !selectedArchetype) {
      Alert.alert('Error', 'Please fill in all fields and select an archetype.');
      return;
    }
  
    if (!currentUser) {
      Alert.alert('Error', 'No user signed in. Please go back and sign in or play as guest.');
      return;
    }
  
    const playerData = {
      uid: currentUser.uid,
      name: trimmedName,
      hometown: trimmedHometown,
      archetype: selectedArchetype,
      speed: assignedSpeed,
      createdAt: Timestamp.now(),
    };
  
    try {
      console.log(`Saving PlayerData for UID ${currentUser.uid}:`, playerData);
  
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(userDocRef, playerData, { merge: true });
      console.log('PlayerData saved to Firestore.');
  
      await savePlayerDataLocal(playerData);
      console.log('PlayerData saved locally.');
  
      navigation.navigate('Lore', { loreId: 'intro' });
      console.log("Navigation to Lore succeeded.");
  
    } catch (error) {
      console.error("Failed to create character:", error);
      Alert.alert('Error', 'Failed to create character. Please try again.');
    }
  };
  
  

  return (
    <View style={pixel.container}>
      <Text style={pixel.title}>CREATE YOUR CHARACTER</Text>

      <TextInput
        placeholder="name"
        // --- Use brighter placeholder color ---
        placeholderTextColor={'white'} // Changed from colors.placeholder
        style={pixel.input} // Uses style with bottom border from context
        autoCapitalize="words"
        onChangeText={setName}
        value={name}
      />

      <TextInput
        placeholder="hometown"
         // --- Use brighter placeholder color ---
        placeholderTextColor={'white'} // Changed from colors.placeholder
        style={pixel.input} // Uses style with bottom border from context
        autoCapitalize="words"
        onChangeText={setHometown}
        value={hometown}
      />
      {/* Archetype Selection */}
      <Text style={styles.archetypeLabel}>Choose Archetype:</Text>
      <View style={styles.archetypeContainer}>
          {ARCHETYPES.map((arch) => (
              <TouchableOpacity
                  key={arch}
                  style={[
                      styles.archetypeButton,
                      selectedArchetype === arch && styles.archetypeSelected // Highlight selected
                  ]}
                  onPress={() => setSelectedArchetype(arch)}
              >
                  <Text style={[
                       styles.archetypeButtonText,
                       selectedArchetype === arch && styles.archetypeSelectedText
                  ]}>
                      {arch}
                  </Text>
              </TouchableOpacity>
          ))}
      </View>

      {/* Create Character Button */}
      <TouchableOpacity
        style={[pixel.button, styles.createButton]}
        onPress={handleCreateCharacter}
        // Disable button until archetype is selected
        disabled={!selectedArchetype}
      >
        <Text style={pixel.buttonText}>create character</Text>
      </TouchableOpacity>

       {/* Optional Back Button */}
       {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <Text style={pixel.secondaryButtonText}>back</Text>
       </TouchableOpacity> */}
    </View>
  );
}

// Add/Update Styles
const styles = StyleSheet.create({
   archetypeLabel: {
       color: 'white',
       fontFamily: '8bit',
       fontSize: 16,
       marginTop: 25,
       marginBottom: 10,
   },
   archetypeContainer: {
       width: '90%',
       marginBottom: 20,
   },
   archetypeButton: {
       backgroundColor: 'rgba(255, 255, 255, 0.1)',
       paddingVertical: 12,
       paddingHorizontal: 15,
       borderRadius: 5,
       marginBottom: 10,
       borderWidth: 1,
       borderColor: 'rgba(255, 255, 255, 0.3)',
   },
   archetypeSelected: {
       backgroundColor: pixel.button.backgroundColor, // Use main button color for selected
       borderColor: pixel.button.backgroundColor,
   },
   archetypeButtonText: {
       color: 'white',
       fontFamily: '8bit',
       fontSize: 14,
       textAlign: 'center',
       textTransform: 'lowercase'
   },
   archetypeSelectedText: {
       color: pixel.buttonText.color, // Use main button text color
   },
   createButton: {
       marginTop: 10, // Adjust spacing
   },
   // backButton: { marginTop: 20 }
});
