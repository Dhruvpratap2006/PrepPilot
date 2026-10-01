import { createContext, useState, useEffect, useCallback } from "react";
import { getMe, loginUser, registerUser, logoutUser } from "./services/auth.api";

export const AuthContext = createContext({
    user: null,
    setUser: () => {},
    loading: true,
    setLoading: () => {},
    error: null,
    setError: () => {},
    checkAuth: async () => {},
    handleLogin: async () => {},
    handleRegister: async () => {},
    handleLogout: async () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkAuth = useCallback(async () => {
        try {
            const data = await getMe();
            if (data?.user) {
                setUser(data.user);
                return data.user;
            } else {
                setUser(null);
                return null;
            }
        } catch (err) {
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await loginUser({ email, password });
            if (data?.token) {
                localStorage.setItem("token", data.token);
            }
            setUser(data.user);
            return data.user;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Login failed. Please try again.";
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await registerUser({ username, email, password });
            if (data?.token) {
                localStorage.setItem("token", data.token);
            }
            setUser(data.user);
            return data.user;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Registration failed. Please try again.";
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logoutUser();
        } catch (err) {
            console.error("Logout request error:", err);
        } finally {
            localStorage.removeItem("token");
            setUser(null);
            setLoading(false);
        }
    };

    // Run once when the application boots to check existing session
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                setLoading,
                error,
                setError,
                checkAuth,
                handleLogin,
                handleRegister,
                handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};