import { createContext, useState, useContext, useEffect, useCallback } from "react";

const AuthContext = createContext();

const readUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [isLoggedin, setIsLoggedin] = useState(!!localStorage.getItem("token"));
    const [user, setUser] = useState(readUser());

    const login = (token, userData) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setIsLoggedin(true);
        setUser(userData);
    };

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedin(false);
        setUser(null);
    }, []);

    // Merge new fields into the stored user (e.g. after editing the profile)
    const updateUser = (changes) => {
        setUser((prev) => {
            const next = { ...prev, ...changes };
            localStorage.setItem("user", JSON.stringify(next));
            return next;
        });
    };

    // apiClient fires this when the server says the token is no longer valid
    useEffect(() => {
        window.addEventListener("auth:expired", logout);
        return () => window.removeEventListener("auth:expired", logout);
    }, [logout]);

    return (
        <AuthContext.Provider value={{ isLoggedin, user, isAdmin: user?.role === "admin", login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
