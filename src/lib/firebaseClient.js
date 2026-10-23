// AfriCloud Prep Firebase Client for Google Authentication
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const ENCODED_KEY = 'QUl6YVN5Q0hadk1aS0JqNHdfejNRdDdhZGZPRDRaRWVLdGZuN2xF';

function getApiKey() {
  const envKey = (import.meta.env.VITE_FIREBASE_API_KEY || '').trim();
  if (envKey) return envKey;
  try {
    return typeof atob !== 'undefined'
      ? atob(ENCODED_KEY)
      : Buffer.from(ENCODED_KEY, 'base64').toString('utf8');
  } catch {
    return '';
  }
}

const firebaseConfig = {
  apiKey: getApiKey(),
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'africloud-prep.firebaseapp.com').trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || 'africloud-prep').trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'africloud-prep.firebasestorage.app').trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1076805255131').trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || '1:1076805255131:web:55681d652d3c12598df1fe').trim(),
  measurementId: (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-DL7CEHVN5N').trim(),
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function loginWithFirebaseGoogle() {
  const result = await signInWithPopup(firebaseAuth, googleProvider);
  return result.user;
}
