// screens/SignupScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { pixel } from '../styles/pixelStyles';
import { signup, login } from '../services/auth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<SignupScreenNavigationProp>();

  const handleSignup = async () => {
    if (!email || !password) return Alert.alert("Error", "All fields required.");
    try {
      await signup(email, password);
      await login(email, password);
      Alert.alert('Signup Successful');
      navigation.replace('CharacterCreator');
    } catch (err: any) {
      Alert.alert('Signup Error', err.message);
    }
  };

  return (
    <View style={pixel.container}>
      <Text style={pixel.title}>create account</Text>

      <TextInput placeholder="email" style={pixel.input} autoCapitalize="none"
        value={email} onChangeText={setEmail} placeholderTextColor="#888"/>
      <TextInput placeholder="password" style={pixel.input} secureTextEntry autoCapitalize="none"
        value={password} onChangeText={setPassword} placeholderTextColor="#888"/>

      <TouchableOpacity style={pixel.button} onPress={handleSignup}>
        <Text style={pixel.buttonText}>sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={pixel.subtleText}>← back to login</Text>
      </TouchableOpacity>
    </View>
  );
}
