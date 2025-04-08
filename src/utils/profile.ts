// utils/profile.ts
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { savePlayerDataLocal } from './playerStorage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';

export const checkUserProfile = async (
  navigation: NativeStackNavigationProp<RootStackParamList>
): Promise<void> => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.warn('checkUserProfile: No user logged in, redirecting to ChoiceScreen.');
    navigation.replace('Choice');
    return;
  }

  try {
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const playerData = userDoc.data();
      await savePlayerDataLocal(playerData);
      navigation.replace('MainMenu');
    } else {
      navigation.replace('CharacterCreator');
    }
  } catch (error) {
    console.error('Error checking user profile:', error);
    navigation.replace('Choice');
  }
};
