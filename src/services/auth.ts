import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signup = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);
