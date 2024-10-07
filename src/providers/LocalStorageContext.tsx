// src/providers/LocalStorageContext.tsx
import React, { createContext, useContext, useCallback } from 'react';

interface LocalStorageContextType {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
}

const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined);

export const LocalStorageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const getItem = useCallback((key: string) => {
        return localStorage.getItem(key);
    }, []);

    const setItem = useCallback((key: string, value: string) => {
        localStorage.setItem(key, value);
    }, []);

    const removeItem = useCallback((key: string) => {
        localStorage.removeItem(key);
    }, []);

    return (
        <LocalStorageContext.Provider value={{ getItem, setItem, removeItem }}>
            {children}
        </LocalStorageContext.Provider>
    );
};

export const useLocalStorage = (): LocalStorageContextType => {
    const context = useContext(LocalStorageContext);
    if (!context) {
        throw new Error('useLocalStorage must be used within a LocalStorageProvider');
    }
    return context;
};