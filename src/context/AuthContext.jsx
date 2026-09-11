import { createContext, useContext, useEffect, useState } from "react";
import { subscribeToAuthChanges } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fires immediately with the current user (or null),
        // then again whenever login/logout happens
        const unsubscribe = subscribeToAuthChanges((user) => {
            setCurrentUser(user);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = { currentUser, isLoading };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

// --------------------------------
// Hook to access the current user anywhere in the app
// Usage: const { currentUser } = useAuth();
// --------------------------------
export function useAuth() {
    return useContext(AuthContext);
}