import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAHaRj74BrW8TW164GozEOB3k_KLpQbrsI",
  authDomain: "imposter-677b5.firebaseapp.com",
  databaseURL: "https://imposter-677b5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "imposter-677b5",
  storageBucket: "imposter-677b5.firebasestorage.app",
  messagingSenderId: "499539586788",
  appId: "1:499539586788:web:d0be11f8272b748c6a06f1",
  measurementId: "G-1XWCBCB0JZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const database = getDatabase(app);