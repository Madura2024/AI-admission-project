import React, { useContext } from 'react';
import { AdmissionContext } from '../context/AdmissionContext';
import Step1_Personal from '../components/admission/Step1_Personal';
import Step2_Parent from '../components/admission/Step2_Parent';
import Step3_Address from '../components/admission/Step3_Address';
import Step4_Academic from '../components/admission/Step4_Academic';
import Step5_Admission from '../components/admission/Step5_Admission';
import Step6_Declaration from '../components/admission/Step6_Declaration';

const AdmissionForm = () => {
    const { currentStep, setAdmissionType, admissionType } = useContext(AdmissionContext);

    // Sync type from localStorage on mount
    React.useEffect(() => {
        const storedType = localStorage.getItem('admission_type');
        if (storedType) {
            setAdmissionType(storedType);
        }
    }, [setAdmissionType]);

    // Progress Bar Logic
    const steps = [
        "Candidate", "Parent", "Address", "Academic", "Admission", "Declaration"
    ];

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center text-blue-800 mb-2">
                College Admission Form 2026
            </h1>
            <p className="text-center text-gray-600 mb-8 font-medium">
                Application for: <span className="text-indigo-600">{admissionType || 'UG'}</span>
            </p>

            {/* Stepper */}
            <div className="flex justify-between items-center mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
                {steps.map((label, index) => {
                    const stepNum = index + 1;
                    const isActive = stepNum === currentStep;
                    const isCompleted = stepNum < currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center bg-white px-2">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2
                                ${isActive ? 'bg-blue-600 text-white border-blue-600' :
                                    isCompleted ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-500 border-gray-300'}
                            `}>
                                {isCompleted ? '✓' : stepNum}
                            </div>
                            <span className={`text-xs mt-1 ${isActive ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Form Steps */}
            <div className="bg-white shadow-xl rounded-lg p-6 border border-gray-100">
                {currentStep === 1 && <Step1_Personal />}
                {currentStep === 2 && <Step2_Parent />}
                {currentStep === 3 && <Step3_Address />}
                {currentStep === 4 && <Step4_Academic />}
                {currentStep === 5 && <Step5_Admission />}
                {currentStep === 6 && <Step6_Declaration />}
            </div>
        </div>
    );
};

export default AdmissionForm;
