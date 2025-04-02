// context/UserContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "@/../Firbase/firebaseConfig"; // Adjust the path as needed

const auth = getAuth(app);

export type User = {
  firstName: string;
  lastName: string;
  email: string;
};

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUserState(JSON.parse(stored));
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Extract user info from firebaseUser.
        // This example splits displayName into first and last name.
        const displayName = firebaseUser.displayName || "";
        const nameParts = displayName.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        const updatedUser: User = {
          firstName,
          lastName,
          email: firebaseUser.email || "",
        };
        setUserState(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        setUserState(null);
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, []);

  const setUser = (user: User | null) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    setUserState(user);
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

