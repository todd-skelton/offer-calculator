import { useState, useEffect } from 'react';

export function useLocalStorageState(key, defaultValue) {
    // Initialize state from localStorage or with a default value
    const [state, setState] = useState(() => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    });

    // Watch for changes in state and save to localStorage
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}