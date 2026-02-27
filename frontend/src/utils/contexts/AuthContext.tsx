import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from "react";

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
        try {
            const data = localStorage.getItem("user");
            if (data) {
                const { token } = JSON.parse(data);
                fetch('/me/verify-auth', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({})
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data); // { message: "Good token", data: { ... } }
                    // setUser(data.data) // Only if your endpoint returns user data in a 'data' field
                    setIsLogin(true);
                })
                .catch(error => {
                    console.error("Auth verification error:", error);
                    setIsLogin(false);
                })
                .finally(() => {
                    setIsAuthLoading(false);
                });
            }
        } catch (error) {
            console.error("Auth verification failed", error);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLogin, isAuthLoading, setUser, setIsLogin, setIsAuthLoading }}>
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