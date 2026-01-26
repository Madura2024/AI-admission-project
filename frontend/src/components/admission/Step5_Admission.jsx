import React, { useContext } from 'react';
import { AdmissionContext } from '../../context/AdmissionContext';

const Step5_Admission = () => {
    const {
        admissionDetails, setAdmissionDetails,
        setCurrentStep, saveStep5, loading,
        admissionType // Get type from context
    } = useContext(AdmissionContext);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setAdmissionDetails(prev => ({ ...prev, [name]: val }));
    };

    const onNext = async (e) => {
        e.preventDefault();
        const success = await saveStep5();
        if (success) setCurrentStep(6);
    };

    // Dynamic Branches based on Type
    const getBranches = () => {
        const ugBranches = [
            { val: "CSE", label: "Computer Science & Engg" },
            { val: "ECE", label: "Electronics & Comm Engg" },
            { val: "EEE", label: "Electrical & Electronics Engg" },
            { val: "MECH", label: "Mechanical Engg" },
            { val: "CIVIL", label: "Civil Engg" },
            { val: "IT", label: "Info Tech" },
            { val: "AI_DS", label: "AI & DS" }
        ];
        const pgBranches = [
            { val: "MBA", label: "MBA" },
            { val: "ME_CSE", label: "M.E CSE" },
            { val: "ME_VLSI", label: "M.E VLSI" }
        ];

        if (admissionType === 'PG') return pgBranches;
        return ugBranches; // Default for UG and Lateral
    };

    // Dynamic Fee Display
    const getFee = () => {
        if (admissionType === 'PG') return "₹1,00,000";
        if (admissionType === 'Lateral') return "₹1,20,000";
        return "₹1,50,000"; // UG Default
    };

    return (
        <form onSubmit={onNext} className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Step 5: Admission Details ({admissionType})</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Admission Type *</label>
                    <select name="admission_type" value={admissionDetails.admission_type} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded p-2">
                        <option value="">Select</option>
                        <option value="GQ">Government Quota (GQ)</option>
                        <option value="MQ">Management Quota (MQ)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Allotment / Consortium No</label>
                    <input type="text" name="allotment_no" value={admissionDetails.allotment_no} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Admission Allocated Quota</label>
                    <input type="text" name="quota" value={admissionDetails.quota} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Admitted Branch *</label>
                    <select name="admitted_branch" value={admissionDetails.admitted_branch} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded p-2">
                        <option value="">Select Stream</option>
                        {getBranches().map(b => (
                            <option key={b.val} value={b.val}>{b.label}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2 bg-blue-50 p-4 rounded border border-blue-200">
                    <h3 className="font-bold text-blue-900">Fee Structure Check</h3>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-700">Tuition & Development Fee:</span>
                        <span className="text-xl font-bold text-blue-800">{getFee()}</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">* Estimated fee for {admissionType} (Regular/GQ/MQ may vary).</p>
                </div>

                <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-700 mb-2">Amenities Required</h3>
                    <div className="flex space-x-6">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" name="hostel_required" checked={admissionDetails.hostel_required} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded" />
                            <span>Hostel Required</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" name="transport_required" checked={admissionDetails.transport_required} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded" />
                            <span>Transport Required</span>
                        </label>
                    </div>
                </div>

                {admissionDetails.transport_required && (
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Boarding Point</label>
                        <input type="text" name="boarding_point" value={admissionDetails.boarding_point} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded p-2" />
                    </div>
                )}
            </div>

            <div className="flex justify-between mt-6">
                <button type="button" onClick={() => setCurrentStep(4)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Back</button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Next Step</button>
            </div>
        </form >
    );
};

export default Step5_Admission;
