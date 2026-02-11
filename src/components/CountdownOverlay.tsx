/**
 * 3-2-1 countdown overlay - uses TUNING.countdownMs
 */

import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TUNING } from '../constants/tuning';

type CountdownOverlayProps = { durationMs?: number };

export function CountdownOverlay({ durationMs = TUNING.countdownMs }: CountdownOverlayProps) {
  const startRef = useRef(performance.now());
  const [num, setNum] = useState(Math.ceil(durationMs / 1000));

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = performance.now() - startRef.current;
      const remaining = durationMs - elapsed;
      setNum(Math.max(0, Math.ceil(remaining / 1000)));
    }, 80);
    return () => clearInterval(id);
  }, [durationMs]);

  if (num <= 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.countdown}>
        <Text style={styles.countdownText}>{num}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  countdown: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 120,
    fontFamily: '8bit',
    color: '#EAF205',
  },
});
