// utils/playerStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Centralized Player Data Type
export interface PlayerData {
  uid: string;              // Firebase UID (authenticated or guest)
  name: string;
  hometown: string;
  speed: number;
  archetype: string;
  createdAt?: string;       // Optional ISO string timestamp
}

const PLAYER_DATA_KEY = 'playerData';

/**
 * Saves the player data object locally.
 * @param {PlayerData} data - Player data to save.
 */
export const savePlayerDataLocal = async (data: PlayerData): Promise<void> => {
  if (!data || typeof data !== 'object') {
    console.error('savePlayerDataLocal: Invalid player data.');
    return;
  }

  try {
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem(PLAYER_DATA_KEY, jsonData);
    console.log('✅ Saved player data locally:', data);
  } catch (error) {
    console.error('❌ Error saving player data:', error);
  }
};

/**
 * Retrieves the full player data object from local storage.
 * @returns {Promise<PlayerData | null>} Player data or null.
 */
export const getPlayerDataLocal = async (): Promise<PlayerData | null> => {
  try {
    const jsonData = await AsyncStorage.getItem(PLAYER_DATA_KEY);
    if (!jsonData) {
      console.log('ℹ️ No local player data found.');
      return null;
    }

    const data: PlayerData = JSON.parse(jsonData);
    console.log('✅ Retrieved player data:', data);
    return data;
  } catch (error) {
    console.error('❌ Error retrieving player data:', error);
    return null;
  }
};

/**
 * Retrieves only the player's name.
 * @returns {Promise<string>} Player's name or empty string.
 */
export const getPlayerName = async (): Promise<string> => {
  const data = await getPlayerDataLocal();
  return data?.name ?? '';
};

/**
 * Retrieves only the player's hometown.
 * @returns {Promise<string>} Player's hometown or empty string.
 */
export const getPlayerHometown = async (): Promise<string> => {
  const data = await getPlayerDataLocal();
  return data?.hometown ?? '';
};

/**
 * Clears player data from local storage (used primarily on logout).
 */
export const clearPlayerDataLocal = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PLAYER_DATA_KEY);
    console.log('🗑️ Cleared local player data.');
  } catch (error) {
    console.error('❌ Error clearing player data:', error);
  }
}
