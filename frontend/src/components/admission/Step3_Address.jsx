import React, { useContext, useEffect } from 'react';
import { AdmissionContext } from '../../context/AdmissionContext';

const Step3_Address = () => {
    const {
        addressDetails, setAddressDetails,
        setCurrentStep, saveStep3, loading
    } = useContext(AdmissionContext);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setAddressDetails(prev => ({ ...prev, [name]: val }));
    };

    // Auto-fill Communication address if "Same as" is checked
    useEffect(() => {
        if (addressDetails.isSame) {
            setAddressDetails(prev => ({
                ...prev,
                comm_state: prev.perm_state,
                comm_pincode: prev.perm_pincode
            }));
        }
    }, [addressDetails.isSame, addressDetails.perm_state, addressDetails.perm_pincode]);

    const onNext = async (e) => {
        e.preventDefault();
        const success = await saveStep3();
        if (success) setCurrentStep(4);
    };

    return (
        <form onSubmit={onNext} className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Step 3: Address Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Permanent Address */}
                <div className="bg-white border rounded-md p-4 shadow-sm">
                    <h3 className="text-lg font-medium mb-3 text-blue-700">Permanent Address</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">State *</label>
                            <input type="text" name="perm_state" value={addressDetails.perm_state} onChange={handleChange} required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                            <p className="mt-1 text-xs text-gray-400 italic">Example: Tamil Nadu</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Pincode *</label>
                            <input type="number" name="perm_pincode" value={addressDetails.perm_pincode} onChange={handleChange} required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                            <p className="mt-1 text-xs text-gray-400 italic">Example: 641035</p>
                        </div>
                    </div>
                </div>

                {/* Communication Address */}
                <div className="bg-white border rounded-md p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-medium text-blue-700">Communication Address</h3>
                        <label className="flex items-center text-sm text-gray-600">
                            <input type="checkbox" name="isSame" checked={addressDetails.isSame} onChange={handleChange}
                                className="mr-2 h-4 w-4 text-blue-600 rounded" />
                            Same as Permanent
                        </label>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">State *</label>
                            <input type="text" name="comm_state" value={addressDetails.comm_state} onChange={handleChange} required disabled={addressDetails.isSame}
                                className={`mt-1 block w-full border border-gray-300 rounded-md p-2 ${addressDetails.isSame ? 'bg-gray-100' : ''}`} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Pincode *</label>
                            <input type="number" name="comm_pincode" value={addressDetails.comm_pincode} onChange={handleChange} required disabled={addressDetails.isSame}
                                className={`mt-1 block w-full border border-gray-300 rounded-md p-2 ${addressDetails.isSame ? 'bg-gray-100' : ''}`} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <button type="button" onClick={() => setCurrentStep(2)}
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

export default Step3_Address;
