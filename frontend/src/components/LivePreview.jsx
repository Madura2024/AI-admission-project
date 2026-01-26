import React from 'react';

const LivePreview = ({ formData, title = "Form Preview" }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-indigo-500 h-fit sticky top-10">
            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">{title}</h3>

            <div className="space-y-3">
                {Object.entries(formData).map(([key, value]) => {
                    // Skip internal fields or empty ones if preferred, but for "Live" effect we show what we have
                    if (!value) return null;

                    // Format key for display (e.g., studentName -> Student Name)
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                    return (
                        <div key={key} className="flex justify-between items-start">
                            <span className="text-gray-500 text-sm font-medium w-1/3">{label}:</span>
                            <span className="text-gray-800 font-semibold w-2/3 text-right">{value}</span>
                        </div>
                    );
                })}

                {Object.keys(formData).length === 0 && (
                    <p className="text-gray-400 italic text-center">Start typing to see preview...</p>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Live Updating
                </div>
            </div>
        </div>
    );
};

export default LivePreview;
