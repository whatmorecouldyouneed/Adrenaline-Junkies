/**
 * two big hit areas - left/right - emits onTap("L" | "R")
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type TapButtonsProps = {
  onTap: (side: 'L' | 'R') => void;
  disabled?: boolean;
};

export function TapButtons({ onTap, disabled }: TapButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.left]}
        onPress={() => !disabled && onTap('L')}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text style={styles.label}>L</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.right]}
        onPress={() => !disabled && onTap('R')}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text style={styles.label}>R</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 62, 0.9)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EAF205',
  },
  left: {},
  right: {},
  label: {
    color: '#EAF205',
    fontFamily: '8bit',
    fontSize: 32,
  },
});
