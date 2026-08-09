// ============================================================================
// AuthContext
// ----------------------------------------------------------------------------
// Wraps Firebase Auth's email/password flow behind a plain "admin session"
// vocabulary so no Firebase-specific naming leaks into the rest of the app
// (white-label requirement).
// ============================================================================
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../utils/firebase';
import { disconnectMqttClient } from '../utils/mqttClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      setAuthError(mapAuthError(err.code));
      return false;
    }
  };

  const logout = async () => {
    disconnectMqttClient();
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ adminUser, authLoading, authError, login, logout, setAuthError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

// Translates Firebase's internal error codes into operator-facing copy
// without ever mentioning "Firebase" in the UI.
function mapAuthError(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'Enter a valid admin email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error — check your connection and try again.';
    default:
      return 'Unable to sign in. Please try again.';
  }
}
