// services/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, // Keep for potential future use
  signInAnonymously, // <-- Add this import
  AuthError,
  UserCredential // Import UserCredential type
} from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Import initialized auth instance

/**
 * Signs up a new user with email and password.
 */
export const signup = async (email: string, password: string): Promise<UserCredential> => { // Return UserCredential
  if (!auth) throw new Error("Firebase Auth is not initialized.");
  try {
    console.log(`Attempting signup for: ${email}`);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Signup successful, user:", userCredential.user.uid);
    return userCredential; // Return credential
  } catch (error) {
    const authError = error as AuthError;
    console.error("Firebase Signup Error:", authError.code, authError.message);
    throw authError;
  }
};

/**
 * Logs in a user with email and password.
 */
export const login = async (email: string, password: string): Promise<UserCredential> => { // Return UserCredential
  if (!auth) throw new Error("Firebase Auth is not initialized.");
  try {
    console.log(`Attempting login for: ${email}`);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login successful, user:", userCredential.user.uid);
    return userCredential; // Return credential
  } catch (error) {
    const authError = error as AuthError;
    console.error("Firebase Login Error:", authError.code, authError.message);
    throw authError;
  }
};

/**
 * Signs in the user anonymously.
 */
export const signInGuest = async (): Promise<UserCredential> => { // Return UserCredential
    if (!auth) throw new Error("Firebase Auth is not initialized.");
    try {
        console.log("Attempting anonymous sign-in...");
        const userCredential = await signInAnonymously(auth);
        console.log("Anonymous sign-in successful, user:", userCredential.user.uid);
        return userCredential; // Return credential
    } catch (error) {
        const authError = error as AuthError;
        console.error("Firebase Anonymous Sign-in Error:", authError.code, authError.message);
        throw authError;
    }
}

// Add other auth functions here (logout, password reset, etc.) if needed
