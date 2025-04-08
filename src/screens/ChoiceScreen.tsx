// screens/ChoiceScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { pixel } from '../styles/pixelStyles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { signInGuest } from '../services/auth';

type ChoiceScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Choice'>;

export default function ChoiceScreen() {
  const navigation = useNavigation<ChoiceScreenNavigationProp>();

  const goToLogin = () => navigation.navigate('Login');
  const goToSignup = () => navigation.navigate('Signup');

  const handleGuestSignIn = async () => {
    try {
      const userCredential = await signInGuest();
      console.log("Guest Sign In Success:", userCredential.user.uid);
      navigation.replace('CharacterCreator');
    } catch (error) {
      console.error("Guest Sign In Failed:", error);
      Alert.alert("Error", "Could not sign in as guest. Please try again.");
    }
  };

  return (
    <View style={pixel.container}>
      <Animatable.Text animation="fadeInDown" duration={600} style={pixel.title}>
        adrenaline junkies
      </Animatable.Text>

      <Animatable.View animation="fadeInUp" duration={600} delay={100} style={styles.buttonWrapper}>
        <TouchableOpacity style={pixel.button} onPress={goToLogin}>
          <Text style={pixel.buttonText}>login</Text>
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={600} delay={200} style={styles.buttonWrapper}>
        <TouchableOpacity style={pixel.button} onPress={goToSignup}>
          <Text style={pixel.buttonText}>sign up</Text>
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={600} delay={300} style={styles.buttonWrapper}>
        <TouchableOpacity style={[pixel.button, styles.guestButton]} onPress={handleGuestSignIn}>
          <Text style={[pixel.buttonText, styles.guestButtonText]}>play as guest</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    width: '90%',
    alignItems: 'center',
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderColor: pixel.buttonText.color,
    borderWidth: 1,
    marginTop: 20,
  },
  guestButtonText: {
    color: pixel.buttonText.color,
  },
});
