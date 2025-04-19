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
import app from "@/../Firbase/firebaseConfig";

const auth = getAuth(app);

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  cID?: number;
  firstName?: string;
  lastName?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    console.log("user item", stored)
    if (stored) {
      setUserState(JSON.parse(stored));
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const displayName = firebaseUser.displayName || "";
        const [firstName, ...lastNameParts] = displayName.split(" ");
        const lastName = lastNameParts.join(" ");


        const updatedUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName,
          photoURL: firebaseUser.photoURL || "",
          firstName,
          lastName,
        };

        // Fetch cID from your backend after firebase authentication
        try {
          console.log("updatedUser",updatedUser)
          console.log(updatedUser.cID)
          const response = await fetch(`/api/users-sync?uid=${firebaseUser.uid}`);
          const result = await response.json();
          if (result.success && result.cID) {
            updatedUser.cID = result.cID;
          } else {
            console.warn("No cID found for user.");
          }
        } catch (error) {
          console.error("Error fetching cID:", error);
        }

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
