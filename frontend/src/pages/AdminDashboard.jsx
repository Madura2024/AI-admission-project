import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [viewMode, setViewMode] = useState('applications'); // 'applications' or 'enquiries'
    const [modalLoading, setModalLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [appRes, enqRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admission'),
                axios.get('http://localhost:5000/api/enquiry')
            ]);
            setApplications(appRes.data);
            setEnquiries(enqRes.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data", err);
            setLoading(false);
        }
    };

    const viewDetails = async (appNo) => {
        setModalLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/admission/${appNo}`);
            setSelectedApp(res.data);
        } catch (err) {
            console.error("Error fetching details", err);
            alert("Failed to load details");
        }
        setModalLoading(false);
    };

    // Calculate distributions
    const sourceCounts = enquiries.reduce((acc, enq) => {
        const src = enq.source || 'Unknown';
        acc[src] = (acc[src] || 0) + 1;
        return acc;
    }, {});

    const coimbatoreCount = enquiries.filter(enq =>
        enq.city?.toLowerCase() === 'coimbatore' ||
        enq.city?.toLowerCase().includes('coimbatore')
    ).length;

    const outOfStateCount = enquiries.filter(enq =>
        enq.state?.toLowerCase() !== 'tamil nadu' &&
        enq.state?.toLowerCase() !== 'tn' &&
        enq.state
    ).length;

    return (
        <div className="container mx-auto p-4 max-w-7xl bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                <h1 className="text-3xl font-extrabold text-indigo-900 tracking-tight">Admin Management Console</h1>
                <div className="flex gap-4">
                    <div className="text-center bg-indigo-50 px-6 py-2 rounded-lg border border-indigo-200">
                        <p className="text-xs font-bold text-indigo-600 uppercase">Total Enquiries</p>
                        <p className="text-2xl font-black text-indigo-900">{enquiries.length}</p>
                    </div>
                    <div className="text-center bg-green-50 px-6 py-2 rounded-lg border border-green-200">
                        <p className="text-xs font-bold text-green-600 uppercase">Admissions</p>
                        <p className="text-2xl font-black text-green-900">{applications.length}</p>
                    </div>
                    <div className="text-center bg-amber-50 px-6 py-2 rounded-lg border border-amber-200">
                        <p className="text-xs font-bold text-amber-600 uppercase">Coimbatore</p>
                        <p className="text-2xl font-black text-amber-900">{coimbatoreCount}</p>
                    </div>
                    <div className="text-center bg-rose-50 px-6 py-2 rounded-lg border border-rose-200">
                        <p className="text-xs font-bold text-rose-600 uppercase">Out of State</p>
                        <p className="text-2xl font-black text-rose-900">{outOfStateCount}</p>
                    </div>
                </div>
            </div>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {Object.entries(sourceCounts).map(([source, count]) => (
                    <div key={source} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">{source}</p>
                            <p className="text-xl font-bold text-gray-800">{count}</p>
                        </div>
                        <div className="h-2 w-16 bg-indigo-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${(count / enquiries.length) * 100}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setViewMode('applications')}
                            className={`px-4 py-2 rounded-lg font-bold transition ${viewMode === 'applications' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Applications
                        </button>
                        <button
                            onClick={() => setViewMode('enquiries')}
                            className={`px-4 py-2 rounded-lg font-bold transition ${viewMode === 'enquiries' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Student Enquiries
                        </button>
                    </div>
                    <button onClick={fetchData} className="text-indigo-600 font-semibold hover:text-indigo-800 transition">↻ Refresh</button>
                </div>
                {loading ? (
                    <div className="text-center py-20 text-gray-400 font-medium">Loading Database...</div>
                ) : viewMode === 'applications' ? (
                    applications.length === 0 ? (
                        <div className="bg-white p-20 rounded shadow text-center text-gray-500">
                            No applications received yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            App No
                                        </th>
                                        <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Day & Date
                                        </th>
                                        <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((app) => (
                                        <tr key={app.application_no} className="hover:bg-gray-50 transition border-b border-gray-100">
                                            <td className="px-6 py-6 text-sm">
                                                <p className="text-indigo-900 font-bold font-mono">{app.application_no}</p>
                                            </td>
                                            <td className="px-6 py-6 text-sm">
                                                <span className={`px-3 py-1 font-bold text-[10px] uppercase rounded-full shadow-sm
                                                    ${app.status === 'submitted' ? 'bg-green-100 text-green-700' :
                                                        app.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-sm text-gray-500 font-medium">
                                                {new Date(app.created_at).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-6 text-sm">
                                                <button onClick={() => viewDetails(app.application_no)}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-4 rounded-lg text-xs transition shadow-sm">
                                                    DETAILS
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    enquiries.length === 0 ? (
                        <div className="bg-white p-20 rounded shadow text-center text-gray-500">
                            No enquiries received yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Student Name
                                        </th>
                                        <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Place (City / State)
                                        </th>
                                        <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Course
                                        </th>
                                        <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Phone
                                        </th>
                                        <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Source
                                        </th>
                                        <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Day & Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enquiries.map((enq) => (
                                        <tr key={enq.application_no} className="hover:bg-gray-50 transition border-b border-gray-100">
                                            <td className="px-6 py-6 text-sm">
                                                <p className="text-gray-900 font-bold">{enq.student_name}</p>
                                                <p className="text-[10px] text-indigo-500 font-mono">{enq.application_no}</p>
                                            </td>
                                            <td className="px-6 py-6 text-sm">
                                                <p className="font-semibold text-indigo-700">{enq.city || 'N/A'}</p>
                                                <p className="text-[10px] text-gray-500 uppercase">{enq.state || 'N/A'}</p>
                                            </td>
                                            <td className="px-6 py-6 text-sm text-gray-600">
                                                {enq.course}
                                            </td>
                                            <td className="px-6 py-6 text-sm text-gray-500 font-mono">
                                                {enq.phone_1}
                                            </td>
                                            <td className="px-6 py-6 text-sm">
                                                <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase border border-indigo-100">
                                                    {enq.source}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-sm text-gray-500 font-medium whitespace-nowrap">
                                                {new Date(enq.created_at).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>

            {/* Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
                    <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center pb-3 border-b">
                            <h3 className="text-xl font-bold">Application Details: {selectedApp.application.application_no}</h3>
                            <button onClick={() => setSelectedApp(null)} className="text-black font-bold text-xl">&times;</button>
                        </div>

                        <div className="mt-4 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                            {/* Personal */}
                            <div>
                                <h4 className="font-bold text-blue-600 border-b">Personal Details</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                    <p><strong>Name:</strong> {selectedApp.personal.full_name}</p>
                                    <p><strong>Ref:</strong> {selectedApp.personal.application_no}</p>
                                    <p><strong>Gender:</strong> {selectedApp.personal.gender}</p>
                                    <p><strong>DOB:</strong> {selectedApp.personal.dob?.split('T')[0]}</p>
                                    <p><strong>Community:</strong> {selectedApp.personal.community}</p>
                                    <p><strong>Email:</strong> {selectedApp.personal.email}</p>
                                </div>
                                {selectedApp.personal.photo_url && (
                                    <img src={`http://localhost:5000${selectedApp.personal.photo_url}`} alt="Student" className="h-20 w-20 object-cover mt-2 border" />
                                )}
                            </div>

                            {/* Parent */}
                            <div>
                                <h4 className="font-bold text-blue-600 border-b">Parent Details</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                    <p><strong>Father:</strong> {selectedApp.parent.father_name}</p>
                                    <p><strong>Mother:</strong> {selectedApp.parent.mother_name}</p>
                                    <p><strong>Mobile:</strong> {selectedApp.parent.father_mobile}</p>
                                </div>
                            </div>

                            {/* Academic */}
                            <div>
                                <h4 className="font-bold text-blue-600 border-b">Academic Record</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                    <p><strong>XII Marks:</strong> {selectedApp.academic.total_marks_100}</p>
                                    <p><strong>Cutoff:</strong> {selectedApp.academic.cutoff_200}</p>
                                    <p><strong>Maths:</strong> {selectedApp.academic.maths_marks}</p>
                                    <p><strong>Physics:</strong> {(parseFloat(selectedApp.academic.physics_theory) || 0) + (parseFloat(selectedApp.academic.physics_practical) || 0)}</p>
                                    <p><strong>Chemistry:</strong> {(parseFloat(selectedApp.academic.chemistry_theory) || 0) + (parseFloat(selectedApp.academic.chemistry_practical) || 0)}</p>
                                </div>
                            </div>

                            {/* Admission */}
                            <div>
                                <h4 className="font-bold text-blue-600 border-b">Admission Choice</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                    <p><strong>Branch:</strong> {selectedApp.admission.admitted_branch}</p>
                                    <p><strong>Quota:</strong> {selectedApp.admission.admission_type}</p>
                                    <p><strong>Hostel:</strong> {selectedApp.admission.hostel_required ? 'Yes' : 'No'}</p>
                                    <p><strong>Total Fees:</strong> ₹1,50,000</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2 pt-4 border-t">
                            <button onClick={() => setSelectedApp(null)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Close</button>
                            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Verify Application</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
