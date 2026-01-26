import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import LivePreview from '../components/LivePreview';
import GuidedTooltip from '../components/GuidedTooltip';
import { useDemo } from '../context/DemoContext';

const EnquiryForm = () => {
    const [formData, setFormData] = useState({
        application_no: localStorage.getItem('enquiry_app_no') || '',
        institution: 'KITE', course: '', student_name: '', gender: 'Male', dob: '', aadhar_no: '',
        quota: 'Management Quota', father_name: '', father_occupation: '', mother_name: '',
        mother_occupation: '', annual_income: '', community: 'OC', address: '', pincode: '',
        phone_1: '', phone_2: '', phone_3: '',
        school_name_place: '', school_type: 'Private', board_of_study: 'State board',
        medium_of_instruction: 'English',
        marks_10th_total: '', marks_10th_maths: '', marks_10th_science: '',
        marks_11th_total: '', marks_11th_phy_eco: '', marks_11th_che_comm: '',
        marks_11th_maths_accs: '', marks_11th_comp_bio: '',
        marks_12th_total: '', marks_12th_phy_eco: '', marks_12th_che_comm: '',
        marks_12th_maths_accs: '', marks_12th_comp_bio: '',
        group_12th: '', reg_no_12th: '',
        first_gen_graduate: 'No', pmss: 'No', laptop: 'No',
        college_bus: 'No', bus_boarding_point: '', hostel: 'No',
        source: 'Direct', city: '', state: 'Tamil Nadu', email: ''
    });

    const [errors, setErrors] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [autoSaving, setAutoSaving] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const { isDemoMode } = useDemo();
    const saveTimeout = useRef(null);

    // Auto-save logic
    useEffect(() => {
        if (formData.student_name && formData.phone_1) {
            if (saveTimeout.current) clearTimeout(saveTimeout.current);
            saveTimeout.current = setTimeout(() => {
                performAutoSave();
            }, 2000); // Save after 2 seconds of inactivity
        }
        return () => clearTimeout(saveTimeout.current);
    }, [formData]);

    const performAutoSave = async () => {
        setAutoSaving(true);
        try {
            const res = await api.post('/api/enquiry', formData);
            if (res.data.application_no && !formData.application_no) {
                setFormData(prev => ({ ...prev, application_no: res.data.application_no }));
                localStorage.setItem('enquiry_app_no', res.data.application_no);
            }
        } catch (err) {
            console.error("Auto-save failed", err);
        }
        setAutoSaving(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/api/enquiry', formData);
            setResult(res.data);
            localStorage.removeItem('enquiry_app_no');
        } catch (err) {
            alert("Error submitting form");
        }
        setLoading(false);
    };

    if (result) {
        return (
            <div className="max-w-2xl mx-auto bg-white p-10 rounded-xl shadow-2xl text-center mt-10 animate-fade-in">
                <div className="text-green-500 text-6xl mb-4">✓</div>
                <h2 className="text-3xl font-bold mb-4">Enquiry Submitted!</h2>
                <div className="bg-gray-100 p-4 rounded-lg text-4xl font-mono font-bold text-indigo-600 mb-8 select-all">
                    {result.application_no}
                </div>
                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-indigo-800">AI Recommendation</h3>
                    <p className="text-2xl font-bold text-indigo-600 mt-2">{result.recommendation}</p>
                </div>
                <button onClick={() => window.location.href = '/admission'} className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded font-semibold hover:bg-indigo-700">
                    Proceed to Admission
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-indigo-900 leading-tight">Student Admission Registration</h2>
                    <p className="text-sm text-gray-500">KGiSL Educational Institutions (KITE / KGCAS)</p>
                </div>
                <div className="text-right">
                    {autoSaving && <span className="text-xs text-blue-500 animate-pulse font-medium mr-4 italic">Auto-saving...</span>}
                    {formData.application_no && <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">ID: {formData.application_no}</span>}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* SECTION 1: Institution & Course */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold border-b pb-2 mb-4 text-indigo-800 uppercase tracking-wider">Institution & Course</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Institution</label>
                            <div className="flex gap-4">
                                {['KITE', 'KGCAS'].map(inst => (
                                    <label key={inst} className="flex items-center space-x-2 cursor-pointer">
                                        <input type="radio" name="institution" value={inst} checked={formData.institution === inst} onChange={handleChange} className="w-4 h-4 text-indigo-600" />
                                        <span className="text-sm font-medium">{inst}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Course Interested</label>
                            <input name="course" value={formData.course} onChange={handleChange} placeholder="Enter the course name" className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none text-sm" />
                        </div>
                    </div>
                </div>

                {/* SECTION 2: Personal Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold border-b pb-2 mb-4 text-indigo-800 uppercase tracking-wider">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Student Name</label>
                            <input name="student_name" value={formData.student_name} onChange={handleChange} className="w-full border p-2 rounded text-sm" placeholder="Full name as per records" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-2 rounded text-sm">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                            <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="w-full border p-2 rounded text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhaar No</label>
                            <input name="aadhar_no" value={formData.aadhar_no} onChange={handleChange} className="w-full border p-2 rounded text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Quota</label>
                            <select name="quota" value={formData.quota} onChange={handleChange} className="w-full border p-2 rounded text-sm">
                                <option>Management Quota</option>
                                <option>Government Quota</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Community</label>
                            <select name="community" value={formData.community} onChange={handleChange} className="w-full border p-2 rounded text-sm">
                                <option>OC</option><option>BC</option><option>BCM</option><option>MBC</option><option>SC</option><option>SCA</option><option>ST</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">City/Town</label>
                            <input name="city" value={formData.city} onChange={handleChange} className="w-full border p-2 rounded text-sm" placeholder="e.g. Coimbatore" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                            <input name="state" value={formData.state} onChange={handleChange} className="w-full border p-2 rounded text-sm" placeholder="e.g. Tamil Nadu" />
                        </div>
                    </div>
                </div>

                {/* SECTION 3: Parent & Contact */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold border-b pb-2 mb-4 text-indigo-800 uppercase tracking-wider">Parent & Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Father's Name</label>
                            <input name="father_name" value={formData.father_name} onChange={handleChange} className="w-full border p-2 rounded text-sm" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Occupation</label>
                            <input name="father_occupation" value={formData.father_occupation} onChange={handleChange} className="w-full border p-2 rounded text-sm" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Mother's Name</label>
                            <input name="mother_name" value={formData.mother_name} onChange={handleChange} className="w-full border p-2 rounded text-sm" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Occupation</label>
                            <input name="mother_occupation" value={formData.mother_occupation} onChange={handleChange} className="w-full border p-2 rounded text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Annual Income</label>
                            <input name="annual_income" value={formData.annual_income} onChange={handleChange} className="w-full border p-2 rounded text-sm" placeholder="Rs." />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                            <input name="address" value={formData.address} onChange={handleChange} className="w-full border p-2 rounded text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode</label>
                            <input name="pincode" value={formData.pincode} onChange={handleChange} className="w-full border p-2 rounded text-sm" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Student WhatsApp No</label>
                            <input name="phone_1" value={formData.phone_1} onChange={handleChange} className="w-full border p-2 rounded text-sm font-mono" placeholder="10 digits" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Parent WhatsApp No</label>
                            <input name="phone_2" value={formData.phone_2} onChange={handleChange} className="w-full border p-2 rounded text-sm font-mono" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Alternative No</label>
                            <input name="phone_3" value={formData.phone_3} onChange={handleChange} className="w-full border p-2 rounded text-sm font-mono" />
                        </div>
                    </div>
                </div>

                {/* SECTION 4: Academic Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold border-b pb-2 mb-4 text-indigo-800 uppercase tracking-wider">Academic Record</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-3">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">School Name & Place</label>
                            <input name="school_name_place" value={formData.school_name_place} onChange={handleChange} className="w-full border p-2 rounded text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">School Type</label>
                            <select name="school_type" value={formData.school_type} onChange={handleChange} className="w-full border p-2 rounded text-sm">
                                <option>Private</option><option>Govt. School</option><option>Govt. Aided</option><option>Others</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Board of Study</label>
                            <select name="board_of_study" value={formData.board_of_study} onChange={handleChange} className="w-full border p-2 rounded text-sm">
                                <option>State board</option><option>CBSE</option><option>ICSE</option><option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Instruction Medium</label>
                            <select name="medium_of_instruction" value={formData.medium_of_instruction} onChange={handleChange} className="w-full border p-2 rounded text-sm">
                                <option>English</option><option>Tamil</option>
                            </select>
                        </div>
                        <div className="md:col-span-1 border-l pl-4">
                            <label className="block text-sm font-bold text-gray-500 mb-2 underline">10th STD MARKS</label>
                            <div className="space-y-2">
                                <input name="marks_10th_total" placeholder="Total" value={formData.marks_10th_total} onChange={handleChange} className="w-full border p-1 rounded text-xs" />
                                <input name="marks_10th_maths" placeholder="Maths" value={formData.marks_10th_maths} onChange={handleChange} className="w-full border p-1 rounded text-xs" />
                                <input name="marks_10th_science" placeholder="Science" value={formData.marks_10th_science} onChange={handleChange} className="w-full border p-1 rounded text-xs" />
                            </div>
                        </div>
                        <div className="md:col-span-1 border-l pl-4">
                            <label className="block text-sm font-bold text-gray-500 mb-2 underline">12th STD MARKS</label>
                            <div className="space-y-2">
                                <input name="marks_12th_total" placeholder="Total" value={formData.marks_12th_total} onChange={handleChange} className="w-full border p-1 rounded text-xs bg-yellow-50" />
                                <input name="marks_12th_phy_eco" placeholder="Phy/Eco" value={formData.marks_12th_phy_eco} onChange={handleChange} className="w-full border p-1 rounded text-xs" />
                                <input name="marks_12th_che_comm" placeholder="Che/Comm" value={formData.marks_12th_che_comm} onChange={handleChange} className="w-full border p-1 rounded text-xs" />
                                <input name="marks_12th_maths_accs" placeholder="Maths/Acc" value={formData.marks_12th_maths_accs} onChange={handleChange} className="w-full border p-1 rounded text-xs" />
                            </div>
                        </div>
                        <div className="md:col-span-1 border-l pl-4">
                            <label className="block text-sm font-bold text-gray-500 mb-2 underline">12th GROUP</label>
                            <div className="space-y-2">
                                <input name="group_12th" placeholder="e.g. Maths, Phy, Che" value={formData.group_12th} onChange={handleChange} className="w-full border p-2 rounded text-xs" />
                                <input name="reg_no_12th" placeholder="+2 REG NO" value={formData.reg_no_12th} onChange={handleChange} className="w-full border p-2 rounded text-xs" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 5: Additional Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold border-b pb-2 mb-4 text-indigo-800 uppercase tracking-wider">Additional Requirements</h3>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">First Gen Graduate</label>
                            <select name="first_gen_graduate" value={formData.first_gen_graduate} onChange={handleChange} className="w-full border p-2 rounded text-xs">
                                <option>No</option><option>Yes</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">PMSS Scholarship</label>
                            <select name="pmss" value={formData.pmss} onChange={handleChange} className="w-full border p-2 rounded text-xs">
                                <option>No</option><option>Yes</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Laptop Required</label>
                            <select name="laptop" value={formData.laptop} onChange={handleChange} className="w-full border p-2 rounded text-xs">
                                <option>No</option><option>Yes</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">College Bus</label>
                            <select name="college_bus" value={formData.college_bus} onChange={handleChange} className="w-full border p-2 rounded text-xs">
                                <option>No</option><option>Yes</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Source of Enquiry</label>
                            <select name="source" value={formData.source} onChange={handleChange} className="w-full border p-2 rounded text-xs">
                                <option>Direct</option><option>Student</option><option>Alumni</option><option>Social Media</option><option>KG Employee</option><option>Website</option><option>Consultancy</option><option>Relatives</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-4 left-0 right-0 bg-white p-4 shadow-2xl border-t flex justify-between items-center rounded-lg">
                    <div className="text-sm text-gray-500 font-medium">
                        * All details are tracked for admission process.
                    </div>
                    <button disabled={loading} className="bg-indigo-600 text-white px-12 py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition transform hover:scale-[1.02] shadow-lg disabled:opacity-50">
                        {loading ? 'Submitting...' : 'Register Now'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EnquiryForm;
