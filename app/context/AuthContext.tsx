"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  userId: string | null;
  token: string | null;
  userEmail: string | null;
  userName: string | null;
  userProfilePicture: string | null;
  login: (token: string, userId: string, email: string, name?: string, profilePicture?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  loading: true,
  userId: null,
  token: null,
  userEmail: null,
  userName: null,
  userProfilePicture: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userProfilePicture, setUserProfilePicture] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("userId");
    const e = localStorage.getItem("userEmail");
    const n = localStorage.getItem("userName");
    const p = localStorage.getItem("userProfilePicture");
    if (t) setToken(t);
    if (u) setUserId(u);
    if (e) setUserEmail(e);
    if (n) setUserName(n);
    if (p) setUserProfilePicture(p);
    setLoading(false);
  }, []);

  const login = (t: string, u: string, email: string, name?: string, profilePicture?: string) => {
    localStorage.setItem("token", t);
    localStorage.setItem("userId", u);
    localStorage.setItem("userEmail", email);
    if (name) localStorage.setItem("userName", name);
    if (profilePicture) localStorage.setItem("userProfilePicture", profilePicture);
    setToken(t);
    setUserId(u);
    setUserEmail(email);
    if (name) setUserName(name);
    if (profilePicture) setUserProfilePicture(profilePicture);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userProfilePicture");
    setToken(null);
    setUserId(null);
    setUserEmail(null);
    setUserName(null);
    setUserProfilePicture(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, loading, userId, token, userEmail, userName, userProfilePicture, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
