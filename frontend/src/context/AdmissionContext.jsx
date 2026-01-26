import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AdmissionContext = createContext();

export const AdmissionProvider = ({ children }) => {
    // Current Step (1 to 6)
    const [currentStep, setCurrentStep] = useState(1);

    // Application Number (generated after Step 1 or loaded)
    const [applicationNo, setApplicationNo] = useState(localStorage.getItem('application_no') || null);

    // Form Data States
    const [personalDetails, setPersonalDetails] = useState({
        full_name: '', photo_url: '', aadhar_number: '', gender: '', dob: '', age: '',
        religion: '', nationality: '', community: '', caste: '', blood_group: '', whatsapp_no: '', email: ''
    });

    const [parentDetails, setParentDetails] = useState({
        father_name: '', father_photo_url: '', father_sign_url: '',
        mother_name: '', mother_photo_url: '', mother_sign_url: '',
        annual_income: '', student_mobile: '', father_mobile: '', mother_mobile: '', office_address: ''
    });

    const [addressDetails, setAddressDetails] = useState({
        perm_state: '', perm_pincode: '',
        comm_state: '', comm_pincode: '',
        isSame: false
    });

    const [academicDetails, setAcademicDetails] = useState({
        x_month_year: '', x_register_no: '', x_school_name: '', x_board: '',
        hsc_month_year: '', hsc_register_no: '', hsc_school_name: '', hsc_board: '', hsc_medium: '',
        maths_marks: '', physics_theory: '', physics_practical: '', chemistry_theory: '', chemistry_practical: '', vocational_theory: '',
        attempts: '', total_marks_100: '', cutoff_200: '',
        college_name: '', university: '', passing_month_year: '', percentage_cgpa: '', arrears_count: ''
    });

    const [admissionDetails, setAdmissionDetails] = useState({
        admission_type: '', allotment_no: '', quota: '', admitted_branch: '',
        hostel_required: false, transport_required: false, boarding_point: ''
    });

    // Global Admission Type (UG / PG / Lateral) - selected at start
    const [admissionType, setAdmissionType] = useState('UG');

    // Loading State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to calculate Age
    useEffect(() => {
        if (personalDetails.dob) {
            const birthDate = new Date(personalDetails.dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setPersonalDetails(prev => ({ ...prev, age }));
        }
    }, [personalDetails.dob]);

    // Function to calculate Cutoff
    useEffect(() => {
        const m = parseFloat(academicDetails.maths_marks) || 0;
        const p = (parseFloat(academicDetails.physics_theory) || 0) + (parseFloat(academicDetails.physics_practical) || 0);
        const c = (parseFloat(academicDetails.chemistry_theory) || 0) + (parseFloat(academicDetails.chemistry_practical) || 0);

        // Cutoff Logic: Maths (100) + Physics (50) + Chemistry (50) = 200
        // Provided requirements said: Auto calculate Cutoff (M + P + C out of 200)
        // Usually Engineering Cutoff in TN is M (100) + P/2 (50) + C/2 (50).
        // BUT logic "Marks out of 100" suggests simple inputs.
        // Let's assume M+P+C raw sum if they are out of 100? No, that's 300.
        // Let's assume standard formula: M + (P+C)/2? Or M + P/2 + C/2.
        // User didn't specify formula, just "M + P + C out of 200".
        // I will use M + (P+C)/2 if P and C are 100 each.
        // Wait, fields are Theory + Practical.
        // Let's sum T+P for Physics to get Physics Total (100). Same for Chem.
        // Then Cutoff = Maths + (PhysicsTotal/2) + (ChemTotal/2).

        const physTotal = (parseFloat(academicDetails.physics_theory) || 0) + (parseFloat(academicDetails.physics_practical) || 0);
        const chemTotal = (parseFloat(academicDetails.chemistry_theory) || 0) + (parseFloat(academicDetails.chemistry_practical) || 0);

        const cutoff = m + (physTotal / 2) + (chemTotal / 2);

        setAcademicDetails(prev => ({ ...prev, cutoff_200: cutoff.toFixed(2) }));
    }, [
        academicDetails.maths_marks,
        academicDetails.physics_theory, academicDetails.physics_practical,
        academicDetails.chemistry_theory, academicDetails.chemistry_practical
    ]);

    // Initialize Application if not exists
    const initializeApplication = async () => {
        if (!applicationNo) {
            try {
                const res = await axios.post('http://localhost:5000/api/admission/create');
                setApplicationNo(res.data.application_no);
                localStorage.setItem('application_no', res.data.application_no);
            } catch (err) {
                console.error("Failed to init app", err);
                setError("Failed to initialize application");
            }
        }
    };

    // Save functions for each step
    const saveStep1 = async () => {
        if (!applicationNo) await initializeApplication();
        try {
            await axios.post('http://localhost:5000/api/admission/step1', { application_no: applicationNo, ...personalDetails });
            return true;
        } catch (err) { setError(err.message); return false; }
    };

    const saveStep2 = async () => {
        try {
            await axios.post('http://localhost:5000/api/admission/step2', { application_no: applicationNo, ...parentDetails });
            return true;
        } catch (err) { setError(err.message); return false; }
    };

    const saveStep3 = async () => {
        try {
            await axios.post('http://localhost:5000/api/admission/step3', { application_no: applicationNo, ...addressDetails });
            return true;
        } catch (err) { setError(err.message); return false; }
    };

    const saveStep4 = async () => {
        try {
            await axios.post('http://localhost:5000/api/admission/step4', { application_no: applicationNo, ...academicDetails });
            return true;
        } catch (err) { setError(err.message); return false; }
    };

    const saveStep5 = async () => {
        try {
            await axios.post('http://localhost:5000/api/admission/step5', { application_no: applicationNo, ...admissionDetails });
            return true;
        } catch (err) { setError(err.message); return false; }
    };

    const finalSubmit = async () => {
        try {
            await axios.post('http://localhost:5000/api/admission/submit', { application_no: applicationNo });
            alert("Application Submitted Successfully!");
            localStorage.removeItem('application_no');
            // Redirect or Reset
        } catch (err) { setError(err.message); }
    };

    // Upload Helper
    const uploadFile = async (file, docType) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('application_no', applicationNo);
        formData.append('doc_type', docType);

        try {
            const res = await axios.post('http://localhost:5000/api/admission/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data.url;
        } catch (err) {
            console.error("Upload failed", err);
            return null;
        }
    };

    return (
        <AdmissionContext.Provider value={{
            currentStep, setCurrentStep,
            applicationNo, initializeApplication,
            personalDetails, setPersonalDetails,
            parentDetails, setParentDetails,
            addressDetails, setAddressDetails,
            academicDetails, setAcademicDetails,
            admissionDetails, setAdmissionDetails,
            saveStep1, saveStep2, saveStep3, saveStep4, saveStep5, finalSubmit,
            uploadFile, loading, error,
            admissionType, setAdmissionType
        }}>
            {children}
        </AdmissionContext.Provider>
    );
};
