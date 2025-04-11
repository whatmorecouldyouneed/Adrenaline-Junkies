// screens/ResultsScreen.js (Updated Mock Data)
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { pixel } from '../styles/pixelStyles';
import { useNavigation } from '@react-navigation/native';
// Import refactored get function
import { getPlayerName } from '../utils/playerStorage'; // Still just need name here

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';

type ResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Results'>;
type ResultItem = { rank: number; name: string; time: string; isPlayer?: boolean; };

// --- USER'S NEW MOCK DATA ---
const MOCK_RACE_RESULTS: ResultItem[] = [
  // Data should ideally be sorted by rank for FlatList rendering
  // The animation delay handles the visual reveal order (slowest first)
  { rank: 1, name: 'PLAYER_PLACEHOLDER', time: '9.58s', isPlayer: true }, // We'll replace this name
  { rank: 2, name: 'Willie T', time: '9.72s' },
  { rank: 3, name: 'C KNIGHT', time: '9.85s' },
  { rank: 4, name: 'GHXST', time: '9.91s' },
  { rank: 5, name: 'AA', time: '10.05s'},
  { rank: 6, name: 'Quincy Wilson', time: '10.52s' },
  { rank: 7, name: 'Tyreek Hill', time: '10.54s' },
  { rank: 8, name: 'IShowSpeed', time: '10.58s' },
];
// --- End Mock Data ---

export default function ResultsScreen() {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const [playerName, setPlayerName] = useState('Player');
  const [processedResults, setProcessedResults] = useState<ResultItem[]>([]);
  const [animationsDone, setAnimationsDone] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Use the potentially updated getPlayerName function
      const name = await getPlayerName();
      const finalName = name || 'You';
      setPlayerName(finalName);

      const updatedResults = MOCK_RACE_RESULTS.map(result =>
        result.isPlayer ? { ...result, name: finalName } : result
      );
      setProcessedResults(updatedResults);

      // Set timeout for button visibility
      const totalItems = updatedResults.length;
      const totalDelay = (totalItems -1) * 250 + 600 + 600;
      setTimeout(() => { setAnimationsDone(true); }, totalDelay);
    };
    loadData();
  }, []);

  // renderResultItem function remains the same (calculates delay based on index)
  const renderResultItem = ({ item, index }: { item: ResultItem, index: number }) => {
     const totalItems = processedResults.length;
     const animationDelay = (totalItems - 1 - index) * 250;
     return (
        <Animatable.View /* ... props ... */ >
            <Text style={[styles.resultText, styles.rank]} numberOfLines={1}>{item.rank}</Text>
            <Text style={[styles.resultText, styles.name]} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
            <Text style={[styles.resultText, styles.time]}>{item.time}</Text>
        </Animatable.View>
     );
  };

  const handleContinue = () => { /* ... no change ... */ };

 
  return (
    // --- Wrap content in SafeAreaView ---
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
            <Animatable.Text animation="fadeInDown" duration={600} style={pixel.title}>
                Race Results
            </Animatable.Text>

            {/* Header Row (Optional) */}
            <View style={styles.headerRow}>
                {/* --- Added numberOfLines={1} to Rank Header --- */}
                <Text style={[styles.headerText, styles.rank]} numberOfLines={1}>Rank</Text>
                <Text style={[styles.headerText, styles.name]}>Name</Text>
                <Text style={[styles.headerText, styles.time]}>Time</Text>
            </View>

            {/* Use FlatList for potentially long lists */}
            <FlatList
                data={processedResults}
                renderItem={renderResultItem}
                keyExtractor={(item) => item.rank.toString()}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                // Prevent FlatList content from going under the notch if SafeAreaView wasn't full screen
                // contentInsetAdjustmentBehavior="automatic" // Alternative to SafeAreaView wrapper
            />

            {/* Continue Button */}
            {animationsDone && (
                <Animatable.View animation="fadeInUp" duration={500} style={styles.buttonContainer}>
                <TouchableOpacity style={pixel.button} onPress={handleContinue}>
                    <Text style={pixel.buttonText}>continue</Text>
                </TouchableOpacity>
                </Animatable.View>
            )}
       </View>
    </SafeAreaView>
     // --- End SafeAreaView Wrapper ---
  );
}

// Add specific styles for ResultsScreen
const styles = StyleSheet.create({
  // SafeAreaView takes flex: 1 and background color
  safeArea: {
      flex: 1,
      backgroundColor: pixel.container.backgroundColor, // Use background from pixelStyles
  },
  // Container for actual content alignment within SafeAreaView
  contentContainer: {
      flex: 1, // Allow content to fill SafeAreaView
      alignItems: 'center', // Center content horizontally
      paddingTop: 20, // Add some padding from the top safe area edge
      paddingHorizontal: pixel.container.padding, // Use horizontal padding from pixelStyles
  },
  list: {
      width: '100%', // Take full width within contentContainer padding
      marginTop: 10,
  },
  listContent: {
      paddingBottom: 20, // Space at the bottom of the list
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15, // Inner padding for row content
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(234, 242, 5, 0.5)', // Yellow border
    width: '100%', // Take full width within contentContainer padding
    marginTop: 20,
  },
  headerText: {
    color: '#EAF205', // Yellow
    fontFamily: '8bit',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15, // Inner padding for row content
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)', // Faint white border
    width: '100%',
    alignItems: 'center',
  },
  playerHighlight: {
      backgroundColor: 'rgba(234, 242, 5, 0.15)', // Subtle yellow highlight for player
      borderRadius: 5,
  },
  resultText: {
    color: 'white',
    fontFamily: '8bit',
    fontSize: 16,
  },
  rank: {
    flex: 1.2, // Adjusted flex slightly for rank
    textAlign: 'left',
  },
  name: {
    flex: 4, // Give name more space
    textAlign: 'left',
    paddingHorizontal: 10,
  },
  time: {
    flex: 2, // Adjust flex ratios
    textAlign: 'right',
  },
   buttonContainer: {
      marginTop: 'auto', // Push button towards bottom if list is short
      paddingTop: 10, // Space above button
      paddingBottom: 10, // Space below button
      width: '100%', // Button wrapper takes full width
      alignItems: 'center', // Center the button itself
   }
});
