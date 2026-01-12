// ============================================
// FIREBASE CONFIGURATION
// Replace placeholders with your actual Firebase config
// ============================================

import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, Database } from "firebase/database";

// IMPORTANT: Replace these placeholders with your Firebase project credentials
// You can find these values in your Firebase Console:
// Project Settings > General > Your apps > Firebase SDK snippet
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let database: Database;
let googleProvider: GoogleAuthProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  database = getDatabase(app);
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Create mock objects to prevent app crash when Firebase is not configured
  app = {} as FirebaseApp;
  auth = {} as Auth;
  database = {} as Database;
  googleProvider = new GoogleAuthProvider();
}

export { app, auth, database, googleProvider };
