import { createContext, useContext, useState, useEffect } from "react";
import { getMeApi } from "../api/login"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [expiresAt, setExpiresAt] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("accessToken");
            const expiresAt = localStorage.getItem("expiresAt");
            const user = localStorage.getItem("user");

            if (token && expiresAt && Date.now() < +expiresAt) {
                setToken(token);
                setExpiresAt(+expiresAt);
                if (user) {
                    setUser(JSON.parse(user));
                } else {
                    try {
                        const profile = await getMeApi(token);
                        setUser(profile);
                        localStorage.setItem("user", JSON.stringify(profile));
                    } catch {
                        logout();
                    }
                }
            } else {
                logout();
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (data) => {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("expiresAt", data.expiresAt);
        const profile = await getMeApi(data.accessToken);
        setUser(profile);
        setToken(data.accessToken);
        setExpiresAt(data.expiresAt);
    };

    const updateUser = (data) => {
        if (data) {
            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);
        }
    };

    const me = (data) => {
        if (data) {
            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);
        }
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
                me,
                updateUser,
                isAuthenticated: !!token && !isExpired,
                expiresAt,
                loading
            }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};
