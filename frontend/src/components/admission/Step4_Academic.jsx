import React, { useContext, useState } from 'react';
import { AdmissionContext } from '../../context/AdmissionContext';

const Step4_Academic = () => {
    const {
        academicDetails, setAcademicDetails,
        setCurrentStep, saveStep4, loading,
        admissionType // Get type from context
    } = useContext(AdmissionContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAcademicDetails(prev => ({ ...prev, [name]: value }));
    };

    const onNext = async (e) => {
        e.preventDefault();
        const success = await saveStep4();
        if (success) setCurrentStep(5);
    };

    // Helper options
    const isUG = admissionType === 'UG' || !admissionType;
    const isLateral = admissionType === 'Lateral';
    const isPG = admissionType === 'PG';

    return (
        <form onSubmit={onNext} className="space-y-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Step 4: Academic Details ({admissionType})</h2>

            {/* School details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 10th Std - Always Required */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-2">X Std Details</h3>
                    <div className="space-y-2">
                        <input type="text" name="x_school_name" placeholder="School Name" onChange={handleChange} value={academicDetails.x_school_name} className="w-full p-2 border rounded" required />
                        <input type="text" name="x_board" placeholder="Board (State/CBSE)" onChange={handleChange} value={academicDetails.x_board} className="w-full p-2 border rounded" required />
                        <div className="flex gap-2">
                            <input type="text" name="x_month_year" placeholder="Mon & Year (May 2024)" onChange={handleChange} value={academicDetails.x_month_year} className="w-1/2 p-2 border rounded" required />
                            <input type="text" name="x_register_no" placeholder="Reg No" onChange={handleChange} value={academicDetails.x_register_no} className="w-1/2 p-2 border rounded" required />
                        </div>
                        <select name="school_type" onChange={handleChange} value={academicDetails.school_type || ''} className="w-full p-2 border rounded">
                            <option value="">School Type</option>
                            <option value="Private">Private</option>
                            <option value="Govt. School">Govt. School</option>
                            <option value="Govt. Aided">Govt. Aided</option>
                        </select>
                    </div>
                </div>

                {/* HSC / 12th - Required for UG & PG, NOT for Lateral */}
                {!isLateral && (
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <h3 className="font-bold text-gray-700 mb-2">HSC / XII Details</h3>
                        <div className="space-y-2">
                            <input type="text" name="hsc_school_name" placeholder="School Name" onChange={handleChange} value={academicDetails.hsc_school_name} className="w-full p-2 border rounded" required={!isLateral} />
                            <div className="flex gap-2">
                                <input type="text" name="hsc_board" placeholder="Board" onChange={handleChange} value={academicDetails.hsc_board} className="w-1/2 p-2 border rounded" required={!isLateral} />
                                <select name="hsc_medium" onChange={handleChange} value={academicDetails.hsc_medium} className="w-1/2 p-2 border rounded" required={!isLateral}>
                                    <option value="">Medium</option>
                                    <option value="English">English</option>
                                    <option value="Tamil">Tamil</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <input type="text" name="hsc_month_year" placeholder="Mon & Year" onChange={handleChange} value={academicDetails.hsc_month_year} className="w-1/2 p-2 border rounded" required={!isLateral} />
                                <input type="text" name="hsc_register_no" placeholder="Reg No" onChange={handleChange} value={academicDetails.hsc_register_no} className="w-1/2 p-2 border rounded" required={!isLateral} />
                            </div>
                            <input type="number" name="marks_11th_total" placeholder="11th Std Total Marks" onChange={handleChange} value={academicDetails.marks_11th_total || ''} className="w-full p-2 border rounded" />
                        </div>
                    </div>
                )}
            </div>

            {/* Marks Table - Only for UG (12th Marks) */}
            {isUG && (
                <div className="overflow-x-auto">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">HSC Marks Statement</h3>
                    <table className="min-w-full text-sm text-left text-gray-500 border">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 border">Subject</th>
                                <th className="px-6 py-3 border">Theory</th>
                                <th className="px-6 py-3 border">Practical</th>
                                <th className="px-6 py-3 border">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-4 py-2 font-medium text-gray-900 border">Mathematics</td>
                                <td className="px-4 py-2 border"><input type="number" name="maths_marks" value={academicDetails.maths_marks} onChange={handleChange} className="w-full p-1 border rounded" /></td>
                                <td className="px-4 py-2 border bg-gray-100"> - </td>
                                <td className="px-4 py-2 border font-bold">{academicDetails.maths_marks}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-medium text-gray-900 border">Physics</td>
                                <td className="px-4 py-2 border"><input type="number" name="physics_theory" value={academicDetails.physics_theory} onChange={handleChange} className="w-full p-1 border rounded" /></td>
                                <td className="px-4 py-2 border"><input type="number" name="physics_practical" value={academicDetails.physics_practical} onChange={handleChange} className="w-full p-1 border rounded" /></td>
                                <td className="px-4 py-2 border font-bold">{(parseFloat(academicDetails.physics_theory) || 0) + (parseFloat(academicDetails.physics_practical) || 0)}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-medium text-gray-900 border">Chemistry</td>
                                <td className="px-4 py-2 border"><input type="number" name="chemistry_theory" value={academicDetails.chemistry_theory} onChange={handleChange} className="w-full p-1 border rounded" /></td>
                                <td className="px-4 py-2 border"><input type="number" name="chemistry_practical" value={academicDetails.chemistry_practical} onChange={handleChange} className="w-full p-1 border rounded" /></td>
                                <td className="px-4 py-2 border font-bold">{(parseFloat(academicDetails.chemistry_theory) || 0) + (parseFloat(academicDetails.chemistry_practical) || 0)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="flex gap-4 items-end bg-blue-50 p-4 rounded border border-blue-100 mt-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700">Calculated Cutoff (200)</label>
                            <input type="text" value={academicDetails.cutoff_200} readOnly className="mt-1 block w-full bg-white border border-blue-300 rounded font-bold text-blue-800 p-2" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">No. of Attempts</label>
                            <input type="number" name="attempts" value={academicDetails.attempts} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded p-2" />
                        </div>
                    </div>
                </div>
            )}

            {/* Diploma / Degree Details (Required for Lateral & PG) */}
            {(isLateral || isPG) && (
                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                        {isLateral ? "Diploma Details (Polytechnic)" : "UG Degree Details"}
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="college_name" placeholder="College / Polytechnic Name" value={academicDetails.college_name} onChange={handleChange} className="p-2 border rounded w-full" required />
                        <input type="text" name="university" placeholder="University / Board" value={academicDetails.university} onChange={handleChange} className="p-2 border rounded w-full" required />
                        <input type="text" name="passing_month_year" placeholder="Month/Year of Passing" value={academicDetails.passing_month_year} onChange={handleChange} className="p-2 border rounded w-full" required />
                        <div className="flex gap-2">
                            <input type="number" name="percentage_cgpa" placeholder="% / CGPA" value={academicDetails.percentage_cgpa} onChange={handleChange} className="p-2 border rounded w-1/2" required />
                            <input type="number" name="arrears_count" placeholder="History of Arrears (Count)" value={academicDetails.arrears_count} onChange={handleChange} className="p-2 border rounded w-1/2" />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between mt-6">
                <button type="button" onClick={() => setCurrentStep(3)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Back</button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Next Step</button>
            </div>
        </form>
    );
};

export default Step4_Academic;
