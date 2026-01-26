import React from 'react';

const SystemWalkthrough = () => {
    const steps = [
        { title: "Register", icon: "👤", desc: "Student creates account" },
        { title: "Enquiry", icon: "📝", desc: "Fills basic details & Marks" },
        { title: "AI Analysis", icon: "🤖", desc: "System suggests best course" },
        { title: "Admission", icon: "🎓", desc: "Uploads docs & confirms match" },
        { title: "Approval", icon: "✅", desc: "Admin verifies & approves" }
    ];

    return (
        <div className="container mx-auto p-10 bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen">
            <h1 className="text-4xl font-bold text-center text-indigo-900 mb-16 shadow-sm">How the Admission System Works</h1>

            <div className="max-w-4xl mx-auto relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-2 bg-indigo-200 transform -translate-y-1/2 hidden md:block z-0"></div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center group">
                            <div
                                className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center text-4xl mb-4 border-4 border-indigo-400 transform transition duration-500 hover:scale-125 hover:rotate-12 hover:border-indigo-600 cursor-pointer animate-bounce-slow"
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                {step.icon}
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md text-center w-40 opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 0.3 + 0.5}s`, animationFillMode: 'forwards' }}>
                                <h3 className="font-bold text-indigo-800 text-lg">{step.title}</h3>
                                <p className="text-xs text-gray-600 mt-1">{step.desc}</p>
                            </div>

                            {/* Mobile Connector */}
                            {index < steps.length - 1 && (
                                <div className="h-8 w-1 bg-indigo-300 md:hidden my-2"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-20 text-center">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">Key Features</h3>
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <div className="bg-white p-6 rounded shadow hover:shadow-xl transition">
                        <h4 className="font-bold text-xl mb-2 text-indigo-600">AI Powered</h4>
                        <p className="text-gray-600">Smart algorithms analyze marks to suggest the perfect engineering or arts stream.</p>
                    </div>
                    <div className="bg-white p-6 rounded shadow hover:shadow-xl transition">
                        <h4 className="font-bold text-xl mb-2 text-green-600">Instant Demo</h4>
                        <p className="text-gray-600">Experience the full flow without waiting with our built-in Demo Mode.</p>
                    </div>
                    <div className="bg-white p-6 rounded shadow hover:shadow-xl transition">
                        <h4 className="font-bold text-xl mb-2 text-blue-600">Live Tracking</h4>
                        <p className="text-gray-600">Real-time status updates and guided forms for a smooth experience.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemWalkthrough;
