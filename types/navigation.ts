// types/navigation.ts

// Import specific navigator type if needed elsewhere
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Defines the parameters expected by each screen in the stack
export type RootStackParamList = {
    Choice: undefined; // <--- Added Choice screen
    Login: undefined;  // <--- Added Login screen
    Signup: undefined;
    CharacterCreator: undefined;
    Lore: { loreId: string };
    Game: undefined; // Kept from previous examples, remove if not used
    Results: undefined;
    MainMenu: undefined;
    // Add other screen names and their params here
  };
  
  // Example of exporting specific prop types if needed in multiple files:
  // export type ChoiceScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Choice'>;
  // export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
  // export type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;
  