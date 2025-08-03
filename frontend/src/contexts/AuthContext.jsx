
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);

    useEffect(() => {
        // If a token exists, try to decode it to get user info.
        // In a real app, you might also want to verify it with the server.
        if (token) {
            try {
                // The payload is the second part of the JWT
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setUser({ username: decoded.username, id: decoded.id });
            } catch (error) {
                console.error("Failed to decode token:", error);
                // If token is invalid, clear it
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token;

    const value = {
        token,
        user,
        isAuthenticated,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook for easy access to the context
export const useAuth = () => {
    return useContext(AuthContext);
};
