import React, { useState } from 'react';
import api from '../api';

const StatusTracking = () => {
    const [appNo, setAppNo] = useState('');
    const [status, setStatus] = useState(null);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        setError('');
        setStatus(null);
        try {
            const res = await api.get(`/api/status/${appNo}`);
            setStatus(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Details not found');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Track App</h2>
            <form onSubmit={handleTrack} className="flex gap-2 mb-6">
                <div className="flex-1">
                    <input
                        value={appNo}
                        onChange={(e) => setAppNo(e.target.value)}
                        placeholder="App Number"
                        required
                        className="w-full border p-3 rounded"
                    />
                    <p className="mt-1 text-[10px] text-gray-400 italic">Example: APP12345</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 rounded font-semibold hover:bg-indigo-700 h-[50px]">Track</button>
            </form>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {status && (
                <div className="text-center p-4 bg-gray-50 rounded border">
                    <p className="text-gray-600">Course: <span className="font-bold">{status.selected_course}</span></p>
                    <p className="text-gray-600">Total Fees: <span className="font-bold text-indigo-700">₹1,50,000</span></p>
                    <div className="mt-4">
                        <span className={`px-4 py-2 rounded-full text-white font-bold ${status.status === 'approved' ? 'bg-green-500' :
                            status.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}>
                            {status.status.toUpperCase()}
                        </span>
                    </div>
                    <p className="mt-4 text-xs text-gray-400">App submitted on {new Date(status.created_at).toLocaleDateString()}</p>
                </div>
            )}
        </div>
    );
};

export default StatusTracking;
