
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'; // Added FirebaseApp type
import { initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth'; // Added Auth type
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, Firestore } from "firebase/firestore";

import { getAuth } from 'firebase/auth'; // no persistence
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

// --- Singleton Initialization ---
let app: FirebaseApp; // Add type
let auth: Auth | undefined; // Add type, allow undefined initially
let db: Firestore | undefined; // Add type, allow undefined initially

// Check if Firebase App is already initialized
if (getApps().length === 0) {
  console.log("--- Initializing Firebase App ---");
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
      console.error("Firebase config values missing! Cannot initialize.");
      // Consider throwing an error here to halt execution
      // throw new Error("Missing Firebase configuration values.");
  }
  try {
      app = initializeApp(firebaseConfig);
  } catch (e) {
      console.error("CRITICAL: Error initializing Firebase App:", e);
      // Attempt to get app anyway if init fails (might happen on hot reload)
      if (getApps().length > 0) {
          app = getApp();
      } else {
          // If app truly cannot be initialized or retrieved, handle appropriately
          console.error("CRITICAL: Could not initialize or get Firebase App instance.");
          // Maybe throw error here too
      }
  }
} else {
  console.log("--- Getting existing Firebase App ---");
  app = getApp(); // Get the default app instance
}

// Initialize Auth WITH persistence using the single app instance (if app exists)
if (app) {
    try {
        auth = initializeAuth(app, {
            // @ts-ignore <-- Keep ONLY if TS error persists after fixing @env and types
            persistence: getReactNativePersistence(ReactNativeAsyncStorage)
        });
        console.log("--- Firebase Auth Initialized Successfully ---")
    } catch (error: any) {
        console.error("Error initializing Firebase Auth:", error);
        auth = undefined; // Ensure auth is undefined if init fails
    }
} else {
    console.error("Cannot initialize Firebase Auth because Firebase App failed to initialize.");
    auth = undefined;
}


// Initialize Firestore (if app exists)
if (app) {
    try {
        db = getFirestore(app);
        console.log("--- Firestore Initialized Successfully ---");
    } catch(error) {
        console.error("Error initializing Firestore:", error);
        db = undefined; // Ensure db is undefined if init fails
    }
} else {
     console.error("Cannot initialize Firestore because Firebase App failed to initialize.");
     db = undefined;
}

// Export the initialized/retrieved instances
// Note: auth and db might be undefined if initialization failed
export { auth, app, db };