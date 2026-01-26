import React, { createContext, useState, useContext, useEffect } from 'react';

const DemoContext = createContext();

export const useDemo = () => useContext(DemoContext);

export const DemoProvider = ({ children }) => {
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('demoMode');
        if (stored === 'true') setIsDemoMode(true);
    }, []);

    const toggleDemoMode = () => {
        const newValue = !isDemoMode;
        setIsDemoMode(newValue);
        localStorage.setItem('demoMode', newValue);

        // Dispatch event for non-react parts if any, or just for immediate effect if needed
        window.dispatchEvent(new Event('demoModeChanged'));
    };

    return (
        <DemoContext.Provider value={{ isDemoMode, toggleDemoMode }}>
            {children}
        </DemoContext.Provider>
    );
};
