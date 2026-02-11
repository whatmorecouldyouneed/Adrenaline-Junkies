/**
 * minimal 2d rhythm lane for mvp - server syncs beatIndex, client sends taps
 */

import React from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';

const BEAT_COUNT = 16;
const LANE_HEIGHT = 36;

type RhythmLane2DProps = {
  beatIndex: number;
  onTap: (beat: number) => void;
  disabled?: boolean;
};

export function RhythmLane2D({ beatIndex, onTap, disabled }: RhythmLane2DProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: BEAT_COUNT }, (_, i) => (
        <TouchableWithoutFeedback
          key={i}
          onPress={() => !disabled && onTap(i)}
          disabled={disabled}
        >
          <View
            style={[
              styles.beat,
              i === beatIndex && styles.beatActive,
            ]}
          />
        </TouchableWithoutFeedback>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  beat: {
    height: LANE_HEIGHT,
    backgroundColor: '#1a1a3e',
    marginVertical: 2,
    borderRadius: 4,
  },
  beatActive: {
    backgroundColor: '#EAF205',
  },
});
