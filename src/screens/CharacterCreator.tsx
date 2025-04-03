import React, { useState } from 'react';

import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { pixel } from '../styles/pixelStyles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/env';

export default function CharacterCreator() {
  const [name, setName] = useState('');
  const [hometown, setHometown] = useState('');
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleCreateCharacter = async () => {
    if (!name.trim() || !hometown.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // TODO: Save character data
    // For now, just navigate to the next screen
    nav.navigate('Lore', {
      loreId: 'intro', // 👈 must match LEVELS entry
    });
  };

  return (
    <View style={pixel.container}>
      <Text style={pixel.title}>CREATE YOUR CHARACTER</Text>

      <TextInput
        placeholder="name"
        placeholderTextColor="#888"
        style={pixel.input}
        autoCapitalize="none"
        onChangeText={setName}
      />

      <TextInput
        placeholder="hometown"
        placeholderTextColor="#888"
        style={pixel.input}
        autoCapitalize="none"
        onChangeText={setHometown}
      />

      <TouchableOpacity style={pixel.button} onPress={handleCreateCharacter}>
        <Text style={pixel.buttonText}>create character</Text>
      </TouchableOpacity>
    </View>
  );
} 