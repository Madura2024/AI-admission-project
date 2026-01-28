import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EnquiryData = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/enquiry');
                setEnquiries(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching enquiries", err);
                setLoading(false);
            }
        };
        fetchEnquiries();
    }, []);

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Student Enquiries</h1>
                <p className="text-gray-500">Full list of all inquiries received through the system.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in">
                {loading ? (
                    <div className="py-20 text-center text-gray-400 font-medium">Loading Enquiries...</div>
                ) : enquiries.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">No enquiries found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50 uppercase text-[10px] font-bold text-gray-400 tracking-widest">
                                <tr>
                                    <th className="px-6 py-4 text-left">Student Info</th>
                                    <th className="px-6 py-4 text-left">Contact</th>
                                    <th className="px-6 py-4 text-left">Location</th>
                                    <th className="px-6 py-4 text-left">Course & Source</th>
                                    <th className="px-6 py-4 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {enquiries.map((enq) => (
                                    <tr key={enq.application_no} className="hover:bg-indigo-50/30 transition-colors">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="font-bold text-gray-900">{enq.student_name}</div>
                                            <div className="text-[10px] text-indigo-500 font-mono font-bold uppercase">{enq.application_no}</div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-700">{enq.phone_1}</div>
                                            <div className="text-[10px] text-gray-400">{enq.email}</div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-800">{enq.city || 'N/A'}</div>
                                            <div className="text-[10px] text-gray-400 uppercase">{enq.state || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-sm text-gray-700 font-medium mb-1">{enq.course}</div>
                                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase border border-indigo-100">
                                                {enq.source}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-xs text-gray-500 font-medium">
                                            {new Date(enq.created_at).toLocaleDateString(undefined, {
                                                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnquiryData;
