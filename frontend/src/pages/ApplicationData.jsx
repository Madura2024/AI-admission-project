import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApplicationData = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admission');
                setApplications(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching applications", err);
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const viewDetails = async (appNo) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/admission/${appNo}`);
            setSelectedApp(res.data);
        } catch (err) {
            alert("Failed to load details");
        }
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-indigo-900 mb-2">Admission Applications</h1>
                <p className="text-gray-500">Official admission forms submitted by students.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-100 animate-fade-in">
                {loading ? (
                    <div className="py-20 text-center text-gray-400 font-medium">Loading Applications...</div>
                ) : applications.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">No applications received yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-indigo-50/30 uppercase text-[10px] font-bold text-indigo-400 tracking-widest">
                                <tr>
                                    <th className="px-6 py-4 text-left">Application No</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    <th className="px-6 py-4 text-left">Submission Date</th>
                                    <th className="px-6 py-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {applications.map((app) => (
                                    <tr key={app.application_no} className="hover:bg-indigo-50/30 transition-all group">
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <p className="text-indigo-900 font-bold font-mono text-lg">{app.application_no}</p>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <span className={`px-4 py-1.5 font-bold text-[10px] uppercase rounded-full shadow-sm
                                                ${app.status === 'submitted' ? 'bg-green-100 text-green-700' :
                                                    app.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500 font-medium">
                                            {new Date(app.created_at).toLocaleDateString(undefined, {
                                                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <button
                                                onClick={() => viewDetails(app.application_no)}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl text-xs transition shadow-md transform hover:-translate-y-0.5"
                                            >
                                                VIEW FULL FORM
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Modal (Inspired by AdminDashboard) */}
            {selectedApp && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm overflow-y-auto h-full w-full z-[100] p-4 flex items-center justify-center animate-fade-in">
                    <div className="relative mx-auto p-8 border w-full max-w-4xl shadow-2xl rounded-3xl bg-white border-indigo-100 scale-100">
                        <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-2xl font-black text-indigo-900">Application File</h3>
                                <p className="text-sm text-gray-400 font-mono">{selectedApp.application.application_no}</p>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-red-500 font-bold text-3xl transition">&times;</button>
                        </div>

                        <div className="mt-8 space-y-8 max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Personal */}
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h4 className="font-black text-indigo-600 uppercase text-xs tracking-widest mb-4 border-b pb-2">Personal Identity</h4>
                                    <div className="space-y-3 text-sm">
                                        <p><span className="text-gray-400 inline-block w-24">Full Name:</span> <span className="font-bold">{selectedApp.personal.full_name}</span></p>
                                        <p><span className="text-gray-400 inline-block w-24">Gender:</span> <span className="font-bold">{selectedApp.personal.gender}</span></p>
                                        <p><span className="text-gray-400 inline-block w-24">Age / DOB:</span> <span className="font-bold">{selectedApp.personal.age} Yrs ({selectedApp.personal.dob?.split('T')[0]})</span></p>
                                        <p><span className="text-gray-400 inline-block w-24">Community:</span> <span className="font-bold">{selectedApp.personal.community}</span></p>
                                        <p><span className="text-gray-400 inline-block w-24">Email:</span> <span className="font-bold text-indigo-600">{selectedApp.personal.email}</span></p>
                                    </div>
                                    {selectedApp.personal.photo_url && (
                                        <div className="mt-6 border-4 border-white shadow-md rounded-xl overflow-hidden inline-block">
                                            <img src={`http://localhost:5000${selectedApp.personal.photo_url}`} alt="Student" className="h-32 w-32 object-cover" />
                                        </div>
                                    )}
                                </div>

                                {/* Admission */}
                                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                                    <h4 className="font-black text-indigo-600 uppercase text-xs tracking-widest mb-4 border-b pb-2">Academic Selection</h4>
                                    <div className="space-y-3 text-sm">
                                        <p><span className="text-gray-400 inline-block w-32">Branch Admitted:</span> <span className="font-bold text-indigo-900">{selectedApp.admission.admitted_branch}</span></p>
                                        <p><span className="text-gray-400 inline-block w-32">Quota / Type:</span> <span className="font-bold underline">{selectedApp.admission.admission_type} ({selectedApp.admission.quota})</span></p>
                                        <p><span className="text-gray-400 inline-block w-32">Hostel Required:</span> <span className={`font-bold ${selectedApp.admission.hostel_required ? 'text-green-600' : 'text-gray-500'}`}>{selectedApp.admission.hostel_required ? 'YES' : 'NO'}</span></p>
                                        <p><span className="text-gray-400 inline-block w-32">Transport:</span> <span className="font-bold">{selectedApp.admission.transport_required ? `YES (${selectedApp.admission.boarding_point})` : 'NO'}</span></p>
                                        <p className="mt-4 pt-4 border-t border-indigo-100 flex justify-between items-center text-lg">
                                            <span className="font-bold text-gray-500">Total Fees:</span>
                                            <span className="font-black text-indigo-700">₹1,50,000</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-end gap-3">
                            <button onClick={() => setSelectedApp(null)} className="px-8 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition">Close Preview</button>
                            <button className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg transition">Download PDF</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationData;
