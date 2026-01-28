import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I am your AI Admission Assistant. How can I help you today?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const parseMarks = (text) => {
        const numbers = text.match(/\d+(\.\d+)?/g);
        if (!numbers) return null;

        const lowText = text.toLowerCase();

        // Check for subject-specific marks (e.g., maths 84, physics 71)
        const mathsMatch = lowText.match(/(?:maths?|mathematics)\s*[:=-]?\s*(\d+(?:\.\d+)?)/);
        const physicsMatch = lowText.match(/(?:phy|physics)\s*[:=-]?\s*(\d+(?:\.\d+)?)/);
        const chemistryMatch = lowText.match(/(?:chem|chemistry)\s*[:=-]?\s*(\d+(?:\.\d+)?)/);

        if (mathsMatch || physicsMatch || chemistryMatch) {
            const m = mathsMatch ? parseFloat(mathsMatch[1]) : 0;
            const p = physicsMatch ? parseFloat(physicsMatch[1]) : 0;
            const c = chemistryMatch ? parseFloat(chemistryMatch[1]) : 0;

            // If they provided at least two subjects, calculate a potential engineering cutoff (Maths + (P+C)/2)
            if (m > 0 && (p > 0 || c > 0)) {
                return m + (p + c) / 2;
            }
            // Otherwise return the average of subjects provided
            const subjects = [m, p, c].filter(n => n > 0);
            return subjects.reduce((a, b) => a + b, 0) / subjects.length;
        }

        // If only keywords like "mark" or "score" are used with a single number
        if ((lowText.includes('mark') || lowText.includes('score') || lowText.includes('got')) && numbers.length === 1) {
            return parseFloat(numbers[0]);
        }

        // If multiple numbers are entered without context, assume they are marks and average them
        if (numbers.length > 1) {
            return numbers.reduce((sum, n) => sum + parseFloat(n), 0) / numbers.length;
        }

        // If a single number is entered and it's high enough to be a score (e.g., > 35)
        if (numbers.length === 1 && parseFloat(numbers[0]) >= 35) {
            return parseFloat(numbers[0]);
        }

        return null;
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage = { role: 'user', text: inputText };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const detectedMarks = parseMarks(inputText);

            if (detectedMarks !== null) {
                const res = await axios.post('http://localhost:5001/recommend', { marks: detectedMarks });

                let botReply = `I've analyzed your performance (Score: **${detectedMarks.toFixed(1)}**). Based on this, I recommend: **${res.data.recommended_course}**. ${res.data.message || ''}`;
                setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
            } else {
                // Default helpful responses
                let reply = "I can help you with course recommendations! Just tell me your marks from 10th or 12th. For example: 'maths 80 physics 70' or 'I got 450 marks'";

                const lowInput = inputText.toLowerCase();
                if (lowInput.includes('how') || lowInput.includes('process') || lowInput.includes('steps')) {
                    reply = "The admission process is simple: 1. Fill Enquiry Form, 2. Get AI recommendation, 3. Complete Admission Form, 4. Wait for Admin Approval.";
                } else if (lowInput.includes('fee') || lowInput.includes('cost') || lowInput.includes('pay')) {
                    reply = "Fees vary by course. B.E. / B.Tech courses are typically ₹1,50,000 per year. You can check the 'Courses' page for the full list.";
                } else if (lowInput.includes('hello') || lowInput.includes('hi') || lowInput.includes('hey')) {
                    reply = "Hello! I'm here to help you navigate the admission process. Do you want a course recommendation? Just share your marks!";
                }

                setMessages(prev => [...prev, { role: 'bot', text: reply }]);
            }
        } catch (err) {
            console.error("ChatBot Error:", err);
            setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting to my AI brain at the moment. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {/* Chat Bubble */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-indigo-700 transition-all transform hover:scale-110 group relative"
                >
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500"></span>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-indigo-100 animate-slide-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center shadow-md">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                                🤖
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Admission AI</h3>
                                <div className="flex items-center text-[10px] text-indigo-100 italic">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                                    Online | Ready to help
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-indigo-50/30">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-indigo-50 rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl border border-indigo-50 rounded-tl-none flex space-x-1">
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-indigo-50 flex space-x-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 border border-indigo-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition shadow-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
