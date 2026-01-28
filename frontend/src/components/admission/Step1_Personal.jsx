import React, { useContext, useState } from 'react';
import { AdmissionContext } from '../../context/AdmissionContext';

const Step1_Personal = () => {
    const {
        personalDetails, setPersonalDetails,
        setCurrentStep, saveStep1, uploadFile, loading
    } = useContext(AdmissionContext);

    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersonalDetails(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = async (e) => {
        if (e.target.files[0]) {
            setUploading(true);
            const url = await uploadFile(e.target.files[0], 'candidate_photo');
            if (url) {
                setPersonalDetails(prev => ({ ...prev, photo_url: url }));
            }
            setUploading(false);
        }
    };

    const onNext = async (e) => {
        e.preventDefault();
        const success = await saveStep1();
        if (success) setCurrentStep(2);
    };

    return (
        <form onSubmit={onNext} className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Step 1: Candidate Basic Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Application No is Auto-Generated, display optionally if available */}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Candidate Name (Block Letters) *</label>
                    <input type="text" name="full_name" value={personalDetails.full_name} onChange={handleChange} required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 uppercase" />
                    <p className="mt-1 text-xs text-gray-400 italic">Example: ARUN KUMAR M</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Photo *</label>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    {uploading && <span className="text-xs text-blue-500">Uploading...</span>}
                    {personalDetails.photo_url && <span className="text-xs text-green-500">Photo Uploaded</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                    <input type="number" name="aadhar_number" value={personalDetails.aadhar_number} onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    <p className="mt-1 text-xs text-gray-400 italic">Example: 546789012345</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender *</label>
                    <select name="gender" value={personalDetails.gender} onChange={handleChange} required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                    <input type="date" name="dob" value={personalDetails.dob} onChange={handleChange} required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Age (Auto-calculated)</label>
                    <input type="text" value={personalDetails.age} readOnly
                        className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Religion</label>
                    <input type="text" name="religion" value={personalDetails.religion} onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    <p className="mt-1 text-xs text-gray-400 italic">Example: Hindu / Christian / Muslim</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nationality</label>
                    <input type="text" name="nationality" value={personalDetails.nationality} onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Community *</label>
                    <select name="community" value={personalDetails.community} onChange={handleChange} required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                        <option value="">Select</option>
                        <option value="OC">OC</option>
                        <option value="OBC">OBC</option>
                        <option value="BC">BC</option>
                        <option value="BCM">BCM</option>
                        <option value="MBC">MBC</option>
                        <option value="DNC">DNC</option>
                        <option value="SC">SC</option>
                        <option value="SCA">SCA</option>
                        <option value="ST">ST</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Caste</label>
                    <input type="text" name="caste" value={personalDetails.caste} onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    <p className="mt-1 text-xs text-gray-400 italic">Example: Kongu Vellala Gounder</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                    <select name="blood_group" value={personalDetails.blood_group} onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">WhatsApp No</label>
                    <input type="tel" name="whatsapp_no" value={personalDetails.whatsapp_no} onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    <p className="mt-1 text-xs text-gray-400 italic">Example: 9876543210</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Native Place</label>
                    <input type="text" name="native" value={personalDetails.native || ''} onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                    <input type="email" name="email" value={personalDetails.email} onChange={handleChange} required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    <p className="mt-1 text-xs text-gray-400 italic">Example: arunkumar@gmail.com</p>
                </div>
            </div>

            <div className="flex justify-end mt-6">
                <button type="submit" disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                    Next Step
                </button>
            </div>
        </form>
    );
};

export default Step1_Personal;
