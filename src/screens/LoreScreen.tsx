import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TypeWriter from 'react-native-typewriter';
import { useNavigation } from '@react-navigation/native';
import { getPlayerName } from '../utils/playerStorage';
import { LEVELS } from '../constants/levels';


export default function LoreScreen({ route }: any) {
  const { loreId } = route.params;
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);
  const nav = useNavigation();

  useEffect(() => {
    const load = async () => {
      const name = await getPlayerName();
      const level = LEVELS.find((lvl) => lvl.id === loreId);
      if (level) {
        setText(level.lore(name));
      }
    };
    load();
  }, [loreId]);

  const handleContinue = async () => {
    const level = LEVELS.find((lvl) => lvl.id === loreId);
    if (level?.nextScreen) nav.navigate(level.nextScreen as never);
  };

  return (
    <View style={styles.container}>
      <TypeWriter
        typing={1}
        maxDelay={70}
        minDelay={20}
        onTypingEnd={() => setDone(true)}
        style={styles.text}
      >
        {text}
      </TypeWriter>

      {done && (
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>continue</Text>
        </TouchableOpacity>
      )}
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
  text: {
    color: '#EAF205',
    fontSize: 16,
    fontFamily: '8bit',
    textAlign: 'center',
    lineHeight: 28,
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
