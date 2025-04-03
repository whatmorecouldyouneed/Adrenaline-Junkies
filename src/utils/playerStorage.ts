import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAYER_KEY = 'playerName';

export const savePlayerName = async (name: string) => {
  try {
    await AsyncStorage.setItem(PLAYER_KEY, name);
  } catch (e) {
    console.error('Failed to save player name:', e);
  }
};

export const getPlayerName = async (): Promise<string> => {
  try {
    const name = await AsyncStorage.getItem(PLAYER_KEY);
    return name ?? '';
  } catch (e) {
    console.error('Failed to get player name:', e);
    return '';
  }
};
