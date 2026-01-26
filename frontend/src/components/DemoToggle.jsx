import React from 'react';
import { useDemo } from '../context/DemoContext';

const DemoToggle = () => {
    const { isDemoMode, toggleDemoMode } = useDemo();

    return (
        <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-full border border-gray-300">
            <span className={`text-xs font-bold ${isDemoMode ? 'text-gray-500' : 'text-green-600'}`}>
                REAL
            </span>
            <button
                onClick={toggleDemoMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isDemoMode ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDemoMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
            <span className={`text-xs font-bold ${isDemoMode ? 'text-indigo-600' : 'text-gray-500'}`}>
                DEMO
            </span>
        </div>
    );
};

export default DemoToggle;
