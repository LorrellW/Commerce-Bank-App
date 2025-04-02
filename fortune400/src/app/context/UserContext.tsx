//context/UserContext
"use client";
import react, {createContext, useContext, useState, useEffect } from "react";

type User = {
    firstName: string;
    lastName: string;
    email: string;
};

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
  };
  
  const UserContext = createContext<UserContextType | undefined>(undefined);
  
  export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    }, []);
  
    const handleSetUser = (user: User | null) => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
      setUser(user);
    };
  
    return (
      <UserContext.Provider value={{ user, setUser: handleSetUser }}>
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