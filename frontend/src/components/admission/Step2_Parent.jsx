import React, { useContext, useState } from 'react';
import { AdmissionContext } from '../../context/AdmissionContext';

const Step2_Parent = () => {
    const {
        parentDetails, setParentDetails,
        setCurrentStep, saveStep2, uploadFile, loading
    } = useContext(AdmissionContext);

    const [uploading, setUploading] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setParentDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleUpload = async (file, fieldName, docType) => {
        setUploading(prev => ({ ...prev, [fieldName]: true }));
        const url = await uploadFile(file, docType);
        if (url) {
            setParentDetails(prev => ({ ...prev, [fieldName]: url }));
        }
        setUploading(prev => ({ ...prev, [fieldName]: false }));
    };

    const onNext = async (e) => {
        e.preventDefault();
        const success = await saveStep2();
        if (success) setCurrentStep(3);
    };

    return (
        <form onSubmit={onNext} className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Step 2: Parent / Guardian Details</h2>

            {/* Father Details */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-lg font-medium mb-3 text-blue-700">Father's Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Father Name *</label>
                        <input type="text" name="father_name" value={parentDetails.father_name} onChange={handleChange} required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                        <p className="mt-1 text-xs text-gray-400 italic">Example: SELVAM K</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile No *</label>
                        <input type="tel" name="father_mobile" value={parentDetails.father_mobile} onChange={handleChange} required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                        <p className="mt-1 text-xs text-gray-400 italic">Example: 9443212345</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Father Photo</label>
                        <input type="file" onChange={(e) => handleUpload(e.target.files[0], 'father_photo_url', 'father_photo')}
                            className="mt-1 block w-full text-xs" />
                        {parentDetails.father_photo_url && <span className="text-xs text-green-600">Uploaded</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Father Signature</label>
                        <input type="file" onChange={(e) => handleUpload(e.target.files[0], 'father_sign_url', 'father_sign')}
                            className="mt-1 block w-full text-xs" />
                        {parentDetails.father_sign_url && <span className="text-xs text-green-600">Uploaded</span>}
                    </div>
                </div>
            </div>

            {/* Mother Details */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-lg font-medium mb-3 text-blue-700">Mother's Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mother Name *</label>
                        <input type="text" name="mother_name" value={parentDetails.mother_name} onChange={handleChange} required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                        <p className="mt-1 text-xs text-gray-400 italic">Example: LATHA S</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile No</label>
                        <input type="tel" name="mother_mobile" value={parentDetails.mother_mobile} onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mother Photo</label>
                        <input type="file" onChange={(e) => handleUpload(e.target.files[0], 'mother_photo_url', 'mother_photo')}
                            className="mt-1 block w-full text-xs" />
                        {parentDetails.mother_photo_url && <span className="text-xs text-green-600">Uploaded</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mother Signature</label>
                        <input type="file" onChange={(e) => handleUpload(e.target.files[0], 'mother_sign_url', 'mother_sign')}
                            className="mt-1 block w-full text-xs" />
                        {parentDetails.mother_sign_url && <span className="text-xs text-green-600">Uploaded</span>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Annual Income</label>
                    <input type="number" name="annual_income" value={parentDetails.annual_income} onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                    <p className="mt-1 text-xs text-gray-400 italic">Example: 250000</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Student Mobile No</label>
                    <input type="tel" name="student_mobile" value={parentDetails.student_mobile} onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Office Address (Father/Mother)</label>
                    <textarea name="office_address" value={parentDetails.office_address} onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-24"></textarea>
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <button type="button" onClick={() => setCurrentStep(1)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                    Back
                </button>
                <button type="submit" disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Next Step
                </button>
            </div>
        </form>
    );
};

export default Step2_Parent;
