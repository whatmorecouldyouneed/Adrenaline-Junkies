import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getPlayerName } from '../utils/playerStorage';

export default function ResultsScreen() {
  const nav = useNavigation();
  const [name, setName] = useState('');

  useEffect(() => {
    getPlayerName().then(setName);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>game over</Text>
      <Text style={styles.message}>{name}, thanks for playing adrenaline junkies.</Text>
      <TouchableOpacity style={styles.button} onPress={() => nav.navigate('Login' as never)}>
        <Text style={styles.buttonText}>restart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#010326',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: '8bit',
    fontSize: 18,
    color: '#EAF205',
    marginBottom: 20,
    textTransform: 'lowercase',
  },
  message: {
    fontFamily: '8bit',
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    textTransform: 'lowercase',
  },
  button: {
    backgroundColor: '#EAF205',
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: '8bit',
    fontSize: 14,
    color: '#010326',
    textTransform: 'lowercase',
  },
});
