import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const AdmissionSuccess = () => {
    const location = useLocation();
    const { applicationNo } = location.state || { applicationNo: localStorage.getItem('last_app_no') || 'N/A' };

    return (
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-2xl text-center mt-20 animate-fade-in border border-indigo-50">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-inner">
                ✓
            </div>
            <h2 className="text-4xl font-extrabold mb-4 text-indigo-900">Application Submitted!</h2>
            <p className="text-gray-600 mb-8 text-lg">Your admission application has been successfully received and is being processed.</p>

            <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100 mb-8">
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Your Application Reference Number</p>
                <div className="text-5xl font-black text-indigo-900 font-mono tracking-tighter select-all">
                    {applicationNo}
                </div>
            </div>

            <div className="space-y-4">
                <Link to="/status" state={{ appNo: applicationNo }} className="block w-full bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-200">
                    Track Your Status
                </Link>
                <Link to="/" className="block w-full text-indigo-600 font-bold hover:text-indigo-800 transition py-2">
                    Back to Home
                </Link>
            </div>

            <p className="mt-10 text-sm text-gray-400 italic">
                A confirmation SMS will be sent to your registered mobile number shortly.
            </p>
        </div>
    );
};

export default AdmissionSuccess;
