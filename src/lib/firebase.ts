import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with actual configuration or environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Fallback for the original global if it exists (for backward compatibility during refactor)
const finalConfig = typeof (window as any).__firebase_config !== 'undefined' 
  ? JSON.parse((window as any).__firebase_config) 
  : firebaseConfig;

export const app = initializeApp(finalConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const appId = typeof (window as any).__app_id !== 'undefined' 
  ? (window as any).__app_id 
  : 'default-app-id';
