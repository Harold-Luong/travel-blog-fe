import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [expiresAt, setExpiresAt] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const storedToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");
        const storedExpiresAt = localStorage.getItem("expiresAt");

        if (storedToken && storedExpiresAt) {
            const now = Date.now();
            if (now < parseInt(storedExpiresAt, 10)) {
                setToken(storedToken);
                setUser(storedUser ? JSON.parse(storedUser) : null);
                setExpiresAt(parseInt(storedExpiresAt, 10));
            } else {
                logout();
            }
        }

        setLoading(false);
    }, []);

    const login = (data) => {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("expiresAt", data.expiresAt);
        setToken(data.accessToken);
        setUser(data.user);
        setExpiresAt(data.expiresAt);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("expiresAt");
        setToken(null);
        setUser(null);
        setExpiresAt(null);
    };

    const isExpired = expiresAt ? Date.now() >= expiresAt : true;

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isAuthenticated: !!token && !isExpired,
                expiresAt,
                loading
            }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
