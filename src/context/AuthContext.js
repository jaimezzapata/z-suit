'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Obtener datos adicionales del usuario desde Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          ...userDoc.data(),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login con Google
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Guardar/actualizar usuario en Firestore
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(
        userRef,
        {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: 'profesor',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        },
        { merge: true }
      );

      return { success: true, user: result.user };
    } catch (error) {
      console.error('Error en login con Google:', error);
      return { success: false, error: error.message };
    }
  };

  // Login con Email/Password
  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Actualizar último login
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(
        userRef,
        { lastLogin: new Date().toISOString() },
        { merge: true }
      );

      return { success: true, user: result.user };
    } catch (error) {
      console.error('Error en login con email:', error);
      return { success: false, error: error.message };
    }
  };

  // Registro con Email/Password
  const registerWithEmail = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Crear documento de usuario en Firestore
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
        email,
        displayName: displayName || email.split('@')[0],
        photoURL: null,
        role: 'profesor',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });

      return { success: true, user: result.user };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
