// screens/LoginScreen.tsx
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { pixel } from '../styles/pixelStyles';
import { login } from '../services/auth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { checkUserProfile } from '../utils/profile'

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const reset = () => {
    setEmail('');
    setPassword('');
    setShowEmailInput(false);
    setShowPasswordInput(false);
    Keyboard.dismiss();
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      await login(email, password);
      await checkUserProfile(navigation);
      reset();
    } catch (err: any) {
      Alert.alert('Login Error', err.message || 'Unknown error.');
    }
  };

  const goToSignup = () => {
    reset();
    navigation.navigate('Signup');
  };

  return (
    <View style={pixel.container}>
      <Animatable.Text animation="fadeInDown" duration={600} style={pixel.title}>login</Animatable.Text>

      <TouchableOpacity onPress={() => { setShowEmailInput(true); emailRef.current?.focus(); }}>
        {!showEmailInput && <Animatable.Text style={styles.clickableLabel}>email</Animatable.Text>}
      </TouchableOpacity>
      {showEmailInput && (
        <Animatable.View animation="fadeIn">
          <TextInput ref={emailRef} style={pixel.input} placeholder="email" autoCapitalize="none"
            value={email} onChangeText={setEmail} placeholderTextColor="#888" keyboardType="email-address"/>
        </Animatable.View>
      )}

      <TouchableOpacity onPress={() => { setShowPasswordInput(true); passwordRef.current?.focus(); }}>
        {!showPasswordInput && <Animatable.Text style={styles.clickableLabel}>password</Animatable.Text>}
      </TouchableOpacity>
      {showPasswordInput && (
        <Animatable.View animation="fadeIn">
          <TextInput ref={passwordRef} style={pixel.input} placeholder="password" secureTextEntry autoCapitalize="none"
            value={password} onChangeText={setPassword} placeholderTextColor="#888"/>
        </Animatable.View>
      )}

      {(showEmailInput && showPasswordInput) && (
        <Animatable.View animation="fadeInUp">
          <TouchableOpacity style={pixel.button} onPress={handleLogin}>
            <Text style={pixel.buttonText}>login</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}

      <TouchableOpacity onPress={goToSignup}>
        <Text style={pixel.secondaryButtonText}>need an account? sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  clickableLabel: {
    color: 'white',
    fontSize: 18,
    fontFamily: '8bit',
    marginVertical: 15,
  },
});
