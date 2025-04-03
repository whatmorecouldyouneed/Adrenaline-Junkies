import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { pixel } from '../styles/pixelStyles';
import { signup, login } from '../services/auth';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigation();

  const handleSignup = async () => {
    try {
      await signup(email, password);
      // Automatically log in after successful signup
      await login(email, password);
      Alert.alert('Signup Successful');
      nav.navigate('CharacterCreator' as never);
    } catch (err: any) {
      Alert.alert('Signup Error', err.message);
    }
  };

  const handleStartWithoutAccount = () => {
    nav.navigate('CharacterCreator' as never);
  };

  return (
    <View style={pixel.container}>
      <Text style={pixel.title}>CREATE ACCOUNT</Text>

      <TextInput
        placeholder="email"
        placeholderTextColor="#888"
        style={pixel.input}
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="password"
        placeholderTextColor="#888"
        style={pixel.input}
        secureTextEntry
        autoCapitalize="none"
        onChangeText={setPassword}
      />

      <TouchableOpacity style={pixel.button} onPress={handleSignup}>
        <Text style={pixel.buttonText}>sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={pixel.startWithoutAccount} onPress={handleStartWithoutAccount}>
        <Text style={pixel.buttonText}>start without account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={pixel.subtleButton} onPress={() => nav.goBack()}>
        <Text style={pixel.subtleText}>← back to login</Text>
      </TouchableOpacity>
    </View>
  );
}
