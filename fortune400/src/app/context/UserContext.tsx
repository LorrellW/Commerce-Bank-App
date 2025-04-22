// context/UserContext.tsx
"use client";

import {
  createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "@/../Firbase/firebaseConfig";

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  cID?: number;
  firstName?: string;
  lastName?: string;
}

interface Ctx { user: User | null; setUser: (u: User | null) => void }
const UserContext = createContext<Ctx | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  /* Restore from localStorage on first mount */
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUserState(JSON.parse(saved));
  }, []);

  /* Keep localStorage in sync */
  const setUser = (u: User | null) => {
    if (u) localStorage.setItem("user", JSON.stringify(u));
    else   localStorage.removeItem("user");
    setUserState(u);
  };

  /* If the tab loads and Firebase is already authed, fill basic data
     (cID will already be in localStorage if this device registered before) */
     useEffect(() => {
      const auth = getAuth(app);
    
      return onAuthStateChanged(auth, fb => {
        if (!fb) {
          setUser(null);
          return;
        }
    
        /* If user already in context/localStorage, keep it */
        if (user) return;
    
        /* Otherwise create the bare‑bones user object */
        const fresh: User = {
          uid: fb.uid,
          email: fb.email || "",
          displayName: fb.displayName || "",
          photoURL: fb.photoURL || ""
        };
        setUser(fresh);              // ← value, not function
      });
    }, [user]);                      // add `user` to deps
    

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be inside <UserProvider>");
  return ctx;
};
