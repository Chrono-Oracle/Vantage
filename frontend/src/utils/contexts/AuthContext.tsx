"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface AuthContextType {
  setUser: Dispatch<SetStateAction<any>>;
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  isAuthLoading: boolean;
  setIsAuthLoading: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const { token } = JSON.parse(userStr);

        // ADD THIS CHECK: If token is missing or malformed, don't fetch
        if (!token || typeof token !== "string") {
          console.error("Token missing or not a string");
          setIsAuthLoading(false);
          return;
        }

        fetch("http://localhost:5000/user/verify-auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              console.log(data.message); // This is where 'jwt malformed' is logged
              setIsLogin(false);
            } else {
              setUser(data.data);
              setIsLogin(true);
            }
          })
          .finally(() => setIsAuthLoading(false));
      } catch (e) {
        console.error("Failed to parse user from localstorage", e);
        setIsAuthLoading(false);
      }
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLogin, isAuthLoading, setUser, setIsLogin, setIsAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
