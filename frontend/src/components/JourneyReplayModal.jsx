import React, { useState, useEffect } from 'react';

const JourneyReplayModal = ({ student, onClose }) => {
    const [step, setStep] = useState(0);
    const [displayedValues, setDisplayedValues] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);

    // Full data to simulate typing
    const fullData = {
        name: student.student_name,
        email: "student@example.com", // Mock if not in DB
        phone: "9876543210", // Mock
        marks: student.marks,
        course: student.selected_course
    };

    const stepsList = [
        { label: "Start", action: () => setDisplayedValues({}) },
        { label: "Enquiry: Name", action: () => setDisplayedValues(prev => ({ ...prev, name: fullData.name })) },
        { label: "Enquiry: Marks", action: () => setDisplayedValues(prev => ({ ...prev, marks: fullData.marks })) },
        { label: "AI Suggestion", action: () => setDisplayedValues(prev => ({ ...prev, ai: "Recommended: " + (fullData.marks > 80 ? "Engineering" : "Arts") })) },
        { label: "Admission: Course", action: () => setDisplayedValues(prev => ({ ...prev, course: fullData.course })) },
        { label: "Submitted", action: () => setDisplayedValues(prev => ({ ...prev, status: "Pending Approval" })) }
    ];

    useEffect(() => {
        let timer;
        if (isPlaying && step < stepsList.length - 1) {
            timer = setTimeout(() => {
                setStep(s => s + 1);
            }, 1500);
        } else if (step >= stepsList.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, step]);

    useEffect(() => {
        // Execute action for current step
        if (stepsList[step]) {
            stepsList[step].action();
        }
    }, [step]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg">Student Journey Replay: {student.student_name}</h3>
                    <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded">✕</button>
                </div>

                {/* Body */}
                <div className="p-8 bg-gray-50 min-h-[300px]">

                    {/* Progress Bar */}
                    <div className="flex mb-8">
                        {stepsList.map((s, i) => (
                            <div key={i} className={`flex-1 h-2 rounded mx-1 transition-all duration-500 ${i <= step ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Form Simulation */}
                        <div className="bg-white p-6 rounded shadow border border-gray-200">
                            <h4 className="border-b pb-2 mb-4 font-bold text-gray-500 text-sm uppercase">Simulated Form</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400">Student Name</label>
                                    <div className="h-8 border-b border-gray-300 flex items-center text-indigo-900 font-mono">
                                        {displayedValues.name || <span className="animate-pulse">|</span>}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Marks</label>
                                    <div className="h-8 border-b border-gray-300 flex items-center text-indigo-900 font-mono">
                                        {displayedValues.marks}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Selected Course</label>
                                    <div className="h-8 border-b border-gray-300 flex items-center text-indigo-900 font-mono">
                                        {displayedValues.course}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Events Log */}
                        <div className="bg-black text-green-400 p-4 rounded font-mono text-xs overflow-y-auto h-64">
                            <div className="mb-2 border-b border-gray-700 pb-1">SYSTEM LOGS</div>
                            {stepsList.slice(0, step + 1).map((s, i) => (
                                <div key={i} className="mb-1 opacity-80">&gt; {s.label}... DONE</div>
                            ))}
                            {displayedValues.ai && <div className="text-yellow-400 my-2">★ AI ANALYZED: {displayedValues.ai}</div>}
                            {displayedValues.status && <div className="text-blue-400 mt-2">✓ SUBMISSION COMPLETE</div>}
                            {step === stepsList.length - 1 && <div className="text-white mt-4 animate-pulse">WAITING FOR ADMIN ACTION...</div>}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-white flex justify-end space-x-4">
                    <button
                        onClick={() => { setStep(0); setIsPlaying(true); }}
                        className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded hover:bg-indigo-200 font-bold flex items-center"
                    >
                        {isPlaying ? 'Replaying...' : '▶ Replay Journey'}
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JourneyReplayModal;
