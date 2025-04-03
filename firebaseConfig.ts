// firebaseConfig.ts (Correct Variable Usage & Initialization)

import { initializeApp } from 'firebase/app';
// Correct imports needed for RN persistence:
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// Ensure this package IS installed: npm install @react-native-async-storage/async-storage
// src/types/firebase-auth-shim.d.ts

// Import necessary types from their respective modules
import { Persistence } from 'firebase/auth';
// Import the main class type for AsyncStorage
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Re-declare the 'firebase/auth' module to add the missing export
declare module 'firebase/auth' {
  // Declare the function signature accurately
  // It takes the AsyncStorage class/object and returns a Persistence object
  export function getReactNativePersistence(storage: typeof ReactNativeAsyncStorage): Persistence;
}

// This file tells TypeScript "Trust me, 'firebase/auth' ALSO exports this function
// with this signature", even if its own built-in types forgot to mention it.
// It doesn't add any runtime code, it only fixes the static type checking.
// Import variables using the @env syntax provided by react-native-dotenv
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  // FIREBASE_DATABASE_URL, // Optional
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  // FIREBASE_MEASUREMENT_ID // Import if needed, but not typically used here
} from '@env';

// --- CORRECT: Use the IMPORTED variables ---
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY, // Use the imported variable
  authDomain: FIREBASE_AUTH_DOMAIN, // Use the imported variable
  // databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID, // Use the imported variable
  storageBucket: FIREBASE_STORAGE_BUCKET, // Use the imported variable
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID, // Use the imported variable
  appId: FIREBASE_APP_ID, // Use the imported variable
  // measurementId is usually for Analytics, not core config
};
// --- Do NOT use process.env.VAR_NAME here ---

// Optional: Log the config object AFTER imports to verify values
console.log("--- Firebase Config Being Used (from imports) ---");
console.log(JSON.stringify(firebaseConfig, null, 2));

// Add more robust checks
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    console.error(
        "Firebase config values missing AFTER import from @env! " +
        "Check .env file exists in root, has correct keys/values, " +
        "and babel.config.js includes 'module:react-native-dotenv'. " +
        "Requires clean build after changes."
    );
    // Throwing an error might be better than letting initialization proceed with bad config
    // throw new Error("Firebase configuration is missing essential values.");
}

const app = initializeApp(firebaseConfig);

// CORRECT INITIALIZATION FOR REACT NATIVE WITH PERSISTENCE:
// If you still have the TS error for getReactNativePersistence after cleaning,
// ensure @types/firebase is uninstalled, or use the .d.ts shim workaround.
const auth = initializeAuth(app, {
  // @ts-ignore <-- Keep this ONLY if you absolutely cannot fix the TS error otherwise
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth, app };
