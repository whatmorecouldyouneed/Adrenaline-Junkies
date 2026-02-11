/**
 * game screen - 3d scene + tap buttons
 * single-player: runnerStore | multiplayer: phases (waiting/countdown/race/results)
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { SceneRoot } from '../components/scene/SceneRoot';
import { TapButtons } from '../components/TapButtons';
import { CountdownOverlay } from '../components/CountdownOverlay';
import { useRunnerStore } from '../stores/runnerStore';
import { useMultiplayerPredictionStore } from '../stores/multiplayerPredictionStore';
import { useRaceRoom } from '../contexts/RaceRoomContext';
import { useMultiplayerRoomSync } from '../hooks/useMultiplayerRoomSync';
import { createInputBuffer } from '../logic/inputBuffer';
import { getSortedPlacements } from '../utils/raceUtils';

type GameScreenProps = NativeStackScreenProps<RootStackParamList, 'Game'>;

function handleLeaveRoom(leaveRoom: () => void, goBack: () => void) {
  leaveRoom();
  goBack();
}

export default function GameScreen({ route }: GameScreenProps) {
  const roomId = route.params?.roomId;
  const { room, joinRoom, leaveRoom } = useRaceRoom();
  const navigation = useNavigation();
  const tap = useRunnerStore((s) => s.tap);
  const reset = useRunnerStore((s) => s.reset);
  const runner = useRunnerStore((s) => s.runner);
  const predTap = useMultiplayerPredictionStore((s) => s.tap);
  const predictedRunner = useMultiplayerPredictionStore((s) => s.predictedRunner);
  const [joining, setJoining] = useState(false);
  const [, setTick] = useState(0);
  const inputBuffer = useMemo(() => createInputBuffer(), []);
  const onRoomStateChange = useCallback(() => setTick((n) => n + 1), []);

  const isMultiplayer = !!roomId;
  const phase = room && room.roomId === roomId ? room.state.phase : 'WAITING';

  useEffect(() => {
    if (!roomId) {
      reset();
      return;
    }
    if (room?.roomId === roomId) return;
    setJoining(true);
    joinRoom(roomId).catch(console.error).finally(() => setJoining(false));
  }, [roomId, room?.roomId, joinRoom, reset]);

  useMultiplayerRoomSync(room?.roomId === roomId ? room : null, roomId, inputBuffer, onRoomStateChange);

  const handleTap = (side: 'L' | 'R') => {
    if (isMultiplayer && room) {
      predTap(side, (ev) => room.send('tap', { side: ev.side, seq: ev.seq, t: ev.time }), inputBuffer);
    } else {
      tap(side);
    }
  };

  const displayRunner = isMultiplayer ? predictedRunner : runner;
  const isLocked =
    (displayRunner?.state === 'STUMBLE' && performance.now() < (displayRunner?.lockUntil ?? 0));
  const myReady = room ? room.state.players.get(room.sessionId)?.ready : false;

  if (joining) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.title}>joining...</Text>
      </View>
    );
  }

  if (isMultiplayer && phase === 'WAITING') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>race lobby</Text>
          <Text style={styles.roomText}>room: {roomId}</Text>
          <Text style={styles.stats}>2+ ready to start</Text>
        </View>
        <View style={styles.centered}>
          <TouchableOpacity
            style={[styles.primaryButton, myReady && styles.readyButtonActive]}
            onPress={() => room?.send('ready', !myReady)}
          >
            <Text style={[styles.readyButtonText, myReady && styles.readyButtonActiveText]}>
              {myReady ? 'ready!' : 'ready'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.leaveButton} onPress={() => handleLeaveRoom(leaveRoom, navigation.goBack)}>
            <Text style={styles.leaveButtonText}>leave</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isMultiplayer && phase === 'RESULTS') {
    const placements = getSortedPlacements(room?.state.players);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>results</Text>
        </View>
        <View style={styles.results}>
          {placements.map(({ id, placement, displayName }) => (
            <Text key={id} style={styles.resultRow}>
              #{placement} {displayName} {id === room?.sessionId ? '(you)' : ''}
            </Text>
          ))}
        </View>
        <TouchableOpacity style={[styles.primaryButton, styles.rematchButton]} onPress={() => room?.send('requestRematch')}>
          <Text style={styles.readyButtonText}>rematch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.leaveButton} onPress={() => handleLeaveRoom(leaveRoom, navigation.goBack)}>
          <Text style={styles.leaveButtonText}>leave</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const showCountdown = isMultiplayer && phase === 'COUNTDOWN';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>race</Text>
        {roomId && <Text style={styles.roomText}>room: {roomId}</Text>}
        <Text style={styles.stats}>
          {Math.round(displayRunner.x)}m | v:{displayRunner.v.toFixed(1)} | {displayRunner.state}
        </Text>
      </View>
      <SceneRoot room={isMultiplayer ? room : undefined} />
      <TapButtons onTap={handleTap} disabled={!!isLocked || phase !== 'RUNNING'} />
      {showCountdown && <CountdownOverlay />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010326',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 8,
  },
  title: {
    color: '#EAF205',
    fontSize: 24,
    fontFamily: '8bit',
  },
  roomText: {
    color: 'white',
    fontFamily: '8bit',
    fontSize: 12,
    marginTop: 4,
  },
  stats: {
    color: '#00d4ff',
    fontFamily: '8bit',
    fontSize: 10,
    marginTop: 2,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginVertical: 12,
    borderWidth: 2,
    borderColor: '#EAF205',
    borderRadius: 4,
  },
  readyButtonActive: {
    backgroundColor: '#EAF205',
  },
  readyButtonText: {
    color: '#EAF205',
    fontFamily: '8bit',
    fontSize: 16,
  },
  readyButtonActiveText: {
    color: '#010326',
  },
  leaveButton: {
    paddingVertical: 12,
    marginTop: 20,
  },
  leaveButtonText: {
    color: 'rgba(255,255,255,0.6)',
    fontFamily: '8bit',
    fontSize: 12,
  },
  results: {
    padding: 20,
  },
  resultRow: {
    color: 'white',
    fontFamily: '8bit',
    fontSize: 14,
    marginVertical: 4,
  },
  rematchButton: { alignSelf: 'center' },
});
