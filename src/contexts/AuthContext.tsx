import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup, // ✅ CHANGED: Use Popup
  signOut,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { auth, googleProvider, database } from "@/lib/firebase"; // Adjust path if needed
import { User } from "@/lib/shared"; // Adjust path if needed

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const mapFirebaseUser = (firebaseUser: FirebaseUser, displayName?: string): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email || "",
  displayName: displayName || firebaseUser.displayName || firebaseUser.email?.split("@")[0],
  photoURL: firebaseUser.photoURL || undefined,
});

// Helper: Create Profile
const createUserProfile = async (uid: string, name: string, email: string) => {
  if (!database) return;
  try {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      await set(userRef, { name, email, theme: "light" });
    }
  } catch (error) {
    console.warn("Could not create user profile:", error);
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ 1. REMOVED the getRedirectResult block completely. 
    // We don't need it because Popup returns the user immediately.

    // 2. Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let displayName = firebaseUser.displayName;
        if (!displayName && database) {
          try {
            const userRef = ref(database, `users/${firebaseUser.uid}/name`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
              displayName = snapshot.val();
            }
          } catch (error) {
            console.warn("Could not fetch user name:", error);
          }
        }
        setUser(mapFirebaseUser(firebaseUser, displayName || undefined));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (name && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        await createUserProfile(userCredential.user.uid, name, email);
        setUser(mapFirebaseUser(userCredential.user, name));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  };

  // ✅ UPDATED: Login with Google using Popup
  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);

    try {
      // 1. Open the Popup
      const result = await signInWithPopup(auth, googleProvider);
      
      // 2. Immediate Success Handling
      if (result.user) {
        // Create user profile if it doesn't exist
        await createUserProfile(
          result.user.uid,
          result.user.displayName || result.user.email?.split("@")[0] || "User",
          result.user.email || ""
        );
      }
      // Note: onAuthStateChanged will trigger automatically and update the user state
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google sign-in failed";
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      setError(message);
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};