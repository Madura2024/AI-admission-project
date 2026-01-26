import React, { useContext, useState } from 'react';
import { AdmissionContext } from '../../context/AdmissionContext';

const Step6_Declaration = () => {
    const {
        setCurrentStep, finalSubmit,
        uploadFile, loading, personalDetails, parentDetails
    } = useContext(AdmissionContext);

    const [declared, setDeclared] = useState(false);
    const [candidateSign, setCandidateSign] = useState(personalDetails.photo_url || null); // Reuse logic or new? Let's allow re-upload if needed? No, separate sign.
    // Wait, Step 1 had Photo, Step 2 had Parent Sign. Where is Candidate Sign?
    // User Req: Step 1 had Photo. Step 6 says Candidate Signature.
    // So distinct.

    // We didn't add Candidate Sign in Step 1. So we add it here.
    const [canSignUrl, setCanSignUrl] = useState(null);
    const [parSignUrl, setParSignUrl] = useState(parentDetails.father_sign_url || parentDetails.mother_sign_url || null);

    const [uploading, setUploading] = useState(false);

    const handleUpload = async (file, who) => {
        setUploading(true);
        const type = who === 'candidate' ? 'candidate_sign' : 'parent_sign';
        const url = await uploadFile(file, type);
        if (url) {
            if (who === 'candidate') setCanSignUrl(url);
            else setParSignUrl(url);
        }
        setUploading(false);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!declared) return alert("Please accept the declaration.");
        if (!canSignUrl) return alert("Candidate Signature is required.");

        await finalSubmit();
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Step 6: Declaration</h2>

            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-md text-gray-800 text-sm leading-relaxed">
                <p className="mb-4 font-bold">I hereby declare that:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>The particulars furnished above are true and correct to the best of my knowledge.</li>
                    <li>I have not suppressed any information.</li>
                    <li>If any information is found to be false or incorrect, my admission is liable to be cancelled at any stage.</li>
                    <li>I agree to abide by the rules and regulations of the institution.</li>
                </ul>

                <div className="mt-6 flex items-center">
                    <input type="checkbox" id="declaration" checked={declared} onChange={(e) => setDeclared(e.target.checked)}
                        className="h-5 w-5 text-blue-600 rounded cursor-pointer" />
                    <label htmlFor="declaration" className="ml-3 font-medium cursor-pointer">I agree to the above declaration</label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Candidate Signature */}
                <div className="border p-4 rounded bg-gray-50 flex flex-col items-center">
                    <span className="mb-2 font-medium">Candidate Signature *</span>
                    {canSignUrl ? (
                        <img src={`http://localhost:5000${canSignUrl}`} alt="Candidate Sign" className="h-24 object-contain mb-2 border bg-white" />
                    ) : (
                        <div className="h-24 w-full bg-gray-200 flex items-center justify-center text-gray-400 mb-2 text-xs">No Signature</div>
                    )}
                    <input type="file" required={!canSignUrl} onChange={(e) => handleUpload(e.target.files[0], 'candidate')} className="text-sm w-full" />
                </div>

                {/* Parent Signature (Read-only or Re-upload) */}
                <div className="border p-4 rounded bg-gray-50 flex flex-col items-center">
                    <span className="mb-2 font-medium">Parent / Guardian Signature</span>
                    {parSignUrl ? (
                        <img src={`http://localhost:5000${parSignUrl}`} alt="Parent Sign" className="h-24 object-contain mb-2 border bg-white" />
                    ) : (
                        <div className="h-24 w-full bg-gray-200 flex items-center justify-center text-gray-400 mb-2 text-xs">No Signature from Step 2</div>
                    )}
                    {/* Optional Re-upload */}
                    <input type="file" onChange={(e) => handleUpload(e.target.files[0], 'parent')} className="text-sm w-full" />
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button type="button" onClick={() => setCurrentStep(5)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Back</button>
                <button type="submit" disabled={loading || uploading || !declared}
                    className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-bold text-lg shadow-lg transform hover:scale-105 transition-transform">
                    SUBMIT APPLICATION
                </button>
            </div>
        </form>
    );
};

export default Step6_Declaration;
