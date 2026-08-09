// ============================================================================
// Firebase initialization
// ----------------------------------------------------------------------------
// Centralizes the Firebase app + Auth instance. All values are pulled from
// Vite environment variables so no secrets are hardcoded into source control.
// Fill these in your local .env file (see .env.example) and in your Vercel
// Project Settings -> Environment Variables before deploying.
// ============================================================================
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Fail loudly in dev if config is missing — cheaper than a silent
// auth/invalid-api-key error later.
if (import.meta.env.DEV) {
  const missing = Object.entries(firebaseConfig).filter(([, v]) => !v);
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.warn(
      '[firebase] Missing environment variables:',
      missing.map(([k]) => k).join(', '),
      '\nCopy .env.example to .env and fill in your Firebase project credentials.'
    );
  }
}

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
