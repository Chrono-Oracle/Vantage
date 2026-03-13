// utils/contexts/UserContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type UserProfile = {
  wallet: { balance: number; currency: string };
  fullName: string;
};

type UserContextValue = {
  userProfile: UserProfile | null;
  refreshUserProfile: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const refreshUserProfile = async () => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    let parsed: { token?: string };
    try {
      parsed = JSON.parse(stored);
    } catch {
      return;
    }
    if (!parsed.token) return;

    try {
      const res = await fetch("http://localhost:5000/user/me", {
        headers: { Authorization: `Bearer ${parsed.token}` },
      });
      const body = await res.json();
      if (!res.ok) {
        console.error("Failed to fetch profile:", body.message);
        return;
      }
      setUserProfile(body.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    refreshUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ userProfile, refreshUserProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
