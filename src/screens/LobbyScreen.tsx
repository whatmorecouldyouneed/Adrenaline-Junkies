/**
 * lobby - create or join race room, then navigate to game
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { pixel } from '../styles/pixelStyles';
import { useRaceRoom } from '../contexts/RaceRoomContext';

export default function LobbyScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { createRoom, joinRoom, roomId } = useRaceRoom();
  const [joinId, setJoinId] = useState('');
  const [status, setStatus] = useState<'idle' | 'creating' | 'joining'>('idle');

  const handleCreate = async () => {
    setStatus('creating');
    try {
      const id = await createRoom();
      navigation.navigate('Game', { roomId: id });
    } catch (e) {
      setStatus('idle');
      console.error(e);
    }
  };

  const handleJoin = async () => {
    if (!joinId.trim()) return;
    setStatus('joining');
    try {
      await joinRoom(joinId.trim());
      navigation.navigate('Game', { roomId: joinId.trim() });
    } catch (e) {
      setStatus('idle');
      console.error(e);
    }
  };

  return (
    <View style={pixel.container}>
      <Text style={pixel.title}>race lobby</Text>
      {roomId && (
        <Text style={[pixel.buttonText, { marginBottom: 12, fontSize: 12 }]}>
          room: {roomId}
        </Text>
      )}
      <TouchableOpacity style={pixel.button} onPress={handleCreate} disabled={status !== 'idle'}>
        <Text style={pixel.buttonText}>create room</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="room id"
        placeholderTextColor="white"
        style={pixel.input}
        value={joinId}
        onChangeText={setJoinId}
      />
      <TouchableOpacity style={pixel.button} onPress={handleJoin} disabled={status !== 'idle'}>
        <Text style={pixel.buttonText}>join room</Text>
      </TouchableOpacity>
    </View>
  );
}
