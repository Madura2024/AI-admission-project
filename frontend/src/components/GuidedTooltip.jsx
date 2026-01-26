import React from 'react';

const GuidedTooltip = ({ text }) => {
    return (
        <div className="hidden md:block absolute left-full top-1/2 transform -translate-y-1/2 ml-3 w-48 bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded border border-blue-200 shadow-sm z-10">
            <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 border-8 border-transparent border-r-blue-200"></div>
            {text}
        </div>
    );
};

export default GuidedTooltip;
