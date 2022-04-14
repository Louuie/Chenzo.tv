import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
export const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCkiL_ZyjBEiY6NfD7ihk20nBP-PePkjXU',
  authDomain: 'chenzotv-e811a.firebaseapp.com',
  projectId: 'chenzotv-e811a'
});

export const db = getFirestore();

