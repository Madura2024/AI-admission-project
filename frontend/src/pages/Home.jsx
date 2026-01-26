import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [recentEnquiries, setRecentEnquiries] = useState([]);
    const [loadingEnquiries, setLoadingEnquiries] = useState(true);

    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/enquiry');
                setRecentEnquiries(res.data);
                setLoadingEnquiries(false);
            } catch (err) {
                console.error("Error fetching enquiries on Home page", err);
                setLoadingEnquiries(false);
            }
        };
        fetchEnquiries();
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-indigo-50 to-purple-100 py-32 rounded-3xl overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-bounce-slow"></div>
                <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-bounce-slow" style={{ animationDelay: '2s' }}></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6 animate-fade-in">
                        🚀 Admissions Open for 2026
                    </span>
                    <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight animate-slide-up">
                        The Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Smart Admissions</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        Experience a seamless, AI-powered journey from enquiry to enrollment.
                        Get instant course recommendations and track your status in real-time.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center gap-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <Link to="/enquiry" className="group relative px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-bold shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-1 overflow-hidden">
                            <span className="relative z-10">Start Admission Now</span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition"></div>
                        </Link>
                        <Link to="/walkthrough" className="px-8 py-4 bg-white text-indigo-700 border-2 border-indigo-100 rounded-xl text-lg font-bold hover:border-indigo-300 hover:shadow-md transition">
                            Watch How It Works
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-800">Why Choose Us?</h2>
                    <p className="text-gray-500 mt-2">Built for the next generation of students.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {[
                        { title: "🤖 AI Recommendations", desc: "Get analyzed course suggestions based on your marks.", color: "bg-blue-50 text-blue-600" },
                        { title: "⚡ Instant Updates", desc: "Track every step of your app in real-time.", color: "bg-green-50 text-green-600" },
                        { title: "📱 Digital & Paperless", desc: "100% online process. No queues, no hassle.", color: "bg-purple-50 text-purple-600" },
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
                            <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                                {feature.title.split(' ')[0]}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title.split(' ').slice(1).join(' ')}</h3>
                            <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
            {/* Recent Enquiries Section (Tabular View) */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 border-l-4 border-indigo-600 pl-4">Live Student Enquiries</h2>
                            <p className="text-gray-500 mt-2">Tabular View of Recent Applications</p>
                        </div>
                        <Link to="/admin" className="text-indigo-600 font-bold hover:underline">View Admin Dashboard →</Link>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        {loadingEnquiries ? (
                            <div className="py-20 text-center text-gray-400 font-medium">Loading Live Data...</div>
                        ) : recentEnquiries.length === 0 ? (
                            <div className="py-20 text-center text-gray-400">No recent enquiries found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Student Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Place (City/State)</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Course</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Source</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Day & Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {recentEnquiries.slice(0, 5).map((enq) => (
                                            <tr key={enq.application_no} className="hover:bg-indigo-50/30 transition-colors">
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="font-bold text-gray-900">{enq.student_name}</div>
                                                    <div className="text-[10px] text-indigo-500 font-mono">{enq.application_no}</div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-800">{enq.city || 'N/A'}</div>
                                                    <div className="text-[10px] text-gray-400 uppercase">{enq.state || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">{enq.course}</td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase border border-indigo-100">
                                                        {enq.source}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-xs text-gray-500 font-medium">
                                                    {new Date(enq.created_at).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <p className="mt-8 text-center text-gray-400 text-sm">
                        * This is a live preview of public enquiries for demonstration purposes. Admin access required for full details.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;
