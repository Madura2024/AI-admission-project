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
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([{ sender: 'bot', text: 'Hi! I am your Admission Assistant. Ask me anything about the form or cutoff calculation.' }]);
    const [userMessage, setUserMessage] = useState('');
    const { isDemoMode } = useDemo();
    const saveTimeout = useRef(null);

    // Calculate Cutoff
    const calculateCutoff = () => {
        const maths = parseFloat(formData.marks_12th_maths_accs) || 0;
        const physics = parseFloat(formData.marks_12th_phy_eco) || 0;
        const chemistry = parseFloat(formData.marks_12th_che_comm) || 0;
        return (maths + (physics / 2) + (chemistry / 2)).toFixed(2);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!userMessage.trim()) return;

        const newMessages = [...chatMessages, { sender: 'user', text: userMessage }];
        setChatMessages(newMessages);
        setUserMessage('');

        try {
            const res = await fetch('http://localhost:5001/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });
            const data = await res.json();
            setChatMessages([...newMessages, { sender: 'bot', text: data.response || "I am processing your request." }]);
        } catch (err) {
            setChatMessages([...newMessages, { sender: 'bot', text: "Error connecting to AI service." }]);
        }
    };

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 p-8 rounded-[2rem] bg-gradient-to-br from-indigo-50/50 to-white border border-white shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight leading-tight mb-2">
                        Admission <span className="text-gradient">Registration</span>
                    </h2>
                    <p className="text-slate-500 font-medium flex items-center">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                        KGiSL Educational Institutions • 2026 Academic Year
                    </p>
                </div>
                <div className="mt-4 md:mt-0 relative z-10">
                    {autoSaving && <span className="text-xs text-indigo-500 animate-pulse font-bold mr-4 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 italic">✨ Auto-saving...</span>}
                    {formData.application_no && (
                        <span className="group bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-mono text-sm shadow-xl shadow-slate-200 cursor-default transition-all duration-300 hover:bg-indigo-600">
                            REFERENCE: <span className="text-indigo-400 group-hover:text-white transition-colors">{formData.application_no}</span>
                        </span>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* SECTION 1: Institution & Course */}
                <div className="premium-card p-8 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 rounded-full"></div>
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-xl">🎓</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Institution & Course</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Choose Institution</label>
                            <div className="flex gap-4 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                                {['KITE', 'KGCAS'].map(inst => (
                                    <label key={inst} className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl cursor-pointer transition-all duration-300 ${formData.institution === inst ? 'bg-white shadow-md text-indigo-600 ring-1 ring-slate-100 scale-[1.02]' : 'text-slate-500 hover:bg-slate-100/50'}`}>
                                        <input type="radio" name="institution" value={inst} checked={formData.institution === inst} onChange={handleChange} className="hidden" />
                                        <span className="text-sm font-bold">{inst}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Course Interested</label>
                            <input name="course" value={formData.course} onChange={handleChange} placeholder="Select your preferred discipline" className="input-premium" />
                        </div>
                    </div>
                </div>

                {/* SECTION 2: Personal Details */}
                <div className="premium-card p-8 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-500 rounded-full"></div>
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-xl">👤</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Personal Profile</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
                            <input name="student_name" value={formData.student_name} onChange={handleChange} className="input-premium" placeholder="Enter student's full name" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="input-premium appearance-none cursor-pointer">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">DOB</label>
                            <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="input-premium" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Aadhaar No</label>
                            <input name="aadhar_no" value={formData.aadhar_no} onChange={handleChange} className="input-premium" placeholder="0000 0000 0000" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Quota</label>
                            <select name="quota" value={formData.quota} onChange={handleChange} className="input-premium appearance-none cursor-pointer">
                                <option>Management Quota</option>
                                <option>Government Quota</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Community</label>
                            <select name="community" value={formData.community} onChange={handleChange} className="input-premium appearance-none cursor-pointer">
                                <option>OC</option><option>BC</option><option>BCM</option><option>MBC</option><option>SC</option><option>SCA</option><option>ST</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">EmailID</label>
                            <input name="email" type="email" value={formData.email} onChange={handleChange} className="input-premium" placeholder="student@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Residential City</label>
                            <input name="city" value={formData.city} onChange={handleChange} className="input-premium" placeholder="e.g. Coimbatore" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">State</label>
                            <input name="state" value={formData.state} onChange={handleChange} className="input-premium" placeholder="e.g. Tamil Nadu" />
                        </div>
                    </div>
                </div>

                {/* SECTION 3: Parent & Contact */}
                <div className="premium-card p-8 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 rounded-full"></div>
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-xl">📞</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Family & Contact</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Father's Name</label>
                            <input name="father_name" value={formData.father_name} onChange={handleChange} className="input-premium" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Occupation</label>
                            <input name="father_occupation" value={formData.father_occupation} onChange={handleChange} className="input-premium" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Mother's Name</label>
                            <input name="mother_name" value={formData.mother_name} onChange={handleChange} className="input-premium" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Occupation</label>
                            <input name="mother_occupation" value={formData.mother_occupation} onChange={handleChange} className="input-premium" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Annual Income</label>
                            <input name="annual_income" value={formData.annual_income} onChange={handleChange} className="input-premium" placeholder="In Rupees" />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Address</label>
                            <input name="address" value={formData.address} onChange={handleChange} className="input-premium" placeholder="Detailed Permanent Address" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Pincode</label>
                            <input name="pincode" value={formData.pincode} onChange={handleChange} className="input-premium" placeholder="600001" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-bold text-indigo-600 mb-2 ml-1">🎓 Student WhatsApp</label>
                            <input name="phone_1" value={formData.phone_1} onChange={handleChange} className="input-premium font-bold text-indigo-700" placeholder="10 digits" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">👨‍👩‍👧 Parent Phone</label>
                            <input name="phone_2" value={formData.phone_2} onChange={handleChange} className="input-premium" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">🏠 Emergency Contact</label>
                            <input name="phone_3" value={formData.phone_3} onChange={handleChange} className="input-premium" />
                        </div>
                    </div>
                </div>

                {/* SECTION 4: Academic Details */}
                <div className="premium-card p-8 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500 rounded-full"></div>
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-xl">📝</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Academic Record</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-3">
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Previous School Name & Place</label>
                            <input name="school_name_place" value={formData.school_name_place} onChange={handleChange} className="input-premium" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">School Type</label>
                            <select name="school_type" value={formData.school_type} onChange={handleChange} className="input-premium appearance-none cursor-pointer">
                                <option>Private</option><option>Govt. School</option><option>Govt. Aided</option><option>Others</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Educational Board</label>
                            <select name="board_of_study" value={formData.board_of_study} onChange={handleChange} className="input-premium appearance-none cursor-pointer">
                                <option>State board</option><option>CBSE</option><option>ICSE</option><option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Medium</label>
                            <select name="medium_of_instruction" value={formData.medium_of_instruction} onChange={handleChange} className="input-premium appearance-none cursor-pointer">
                                <option>English</option><option>Tamil</option>
                            </select>
                        </div>
                        <div className="md:col-span-1 bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200">
                            <label className="block text-xs font-black text-slate-400 mb-4 tracking-widest uppercase">10th Std Scores</label>
                            <div className="space-y-4">
                                <input name="marks_10th_total" placeholder="Total Marks" value={formData.marks_10th_total} onChange={handleChange} className="input-premium !py-2 !text-xs !rounded-xl" />
                                <input name="marks_10th_maths" placeholder="Maths" value={formData.marks_10th_maths} onChange={handleChange} className="input-premium !py-2 !text-xs !rounded-xl" />
                                <input name="marks_10th_science" placeholder="Science" value={formData.marks_10th_science} onChange={handleChange} className="input-premium !py-2 !text-xs !rounded-xl" />
                            </div>
                        </div>
                        <div className="md:col-span-1 bg-amber-50/30 p-6 rounded-3xl border border-dashed border-amber-200">
                            <label className="block text-xs font-black text-amber-600/60 mb-4 tracking-widest uppercase">12th Std Scores</label>
                            <div className="space-y-4">
                                <input name="marks_12th_total" placeholder="Total Marks" value={formData.marks_12th_total} onChange={handleChange} className="input-premium !py-2 !text-xs !rounded-xl !bg-white !border-amber-100" />
                                <input name="marks_12th_phy_eco" placeholder="Physics/Eco" value={formData.marks_12th_phy_eco} onChange={handleChange} className="input-premium !py-2 !text-xs !rounded-xl !bg-white" />
                                <input name="marks_12th_che_comm" placeholder="Chemistry/Comm" value={formData.marks_12th_che_comm} onChange={handleChange} className="input-premium !py-2 !text-xs !rounded-xl !bg-white" />
                                <input name="marks_12th_maths_accs" placeholder="Maths/Accounts" value={formData.marks_12th_maths_accs} onChange={handleChange} className="input-premium !py-2 !text-xs !rounded-xl !bg-white" />
                            </div>
                        </div>
                        <div className="md:col-span-1 flex flex-col justify-center">
                            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-center shadow-2xl shadow-indigo-200 relative overflow-hidden group/cutoff">
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/cutoff:opacity-100 transition-opacity"></div>
                                <label className="block text-xs font-black text-indigo-100 mb-3 tracking-widest uppercase">TNEA Cutoff</label>
                                <span className="text-5xl font-black text-white block mb-1 tabular-nums">{calculateCutoff()}</span>
                                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Score / 200</p>
                            </div>
                        </div>
                        <div className="md:col-span-1 pt-6">
                            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Stream & Registration</label>
                            <div className="space-y-4">
                                <input name="group_12th" placeholder="12th Group (e.g. PCB)" value={formData.group_12th} onChange={handleChange} className="input-premium !py-2 !text-xs !rounded-xl" />
                                <input name="reg_no_12th" placeholder="+2 Register Number" value={formData.reg_no_12th} onChange={handleChange} className="input-premium !py-2 !text-xs !rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 5: Additional Info */}
                <div className="premium-card p-8 group relative overflow-hidden mb-24">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 rounded-full"></div>
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-xl">✨</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Additional Options</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">First Gen Grad</label>
                            <select name="first_gen_graduate" value={formData.first_gen_graduate} onChange={handleChange} className="input-premium !py-2 appearance-none">
                                <option>No</option><option>Yes</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">PMSS Scheme</label>
                            <select name="pmss" value={formData.pmss} onChange={handleChange} className="input-premium !py-2 appearance-none">
                                <option>No</option><option>Yes</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">Laptop Needed</label>
                            <select name="laptop" value={formData.laptop} onChange={handleChange} className="input-premium !py-2 appearance-none">
                                <option>No</option><option>Yes</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">College Bus</label>
                            <select name="college_bus" value={formData.college_bus} onChange={handleChange} className="input-premium !py-2 appearance-none">
                                <option>No</option><option>Yes</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">Referral Source</label>
                            <select name="source" value={formData.source} onChange={handleChange} className="input-premium !py-2 appearance-none cursor-pointer">
                                <option>Direct Walk-in</option><option>Current Student</option><option>Alumni</option><option>Social Media</option><option>KG Employee</option><option>Website</option><option>Consultancy</option><option>Relatives</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-6 left-0 right-0 glass-morphism p-6 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-4 z-40 max-w-7xl mx-auto border-white/60">
                    <div className="flex items-center text-slate-500 font-medium">
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mr-3">✓</div>
                        <span className="text-sm">By registering, you agree to our admission policy and verification process.</span>
                    </div>
                    <button disabled={loading} className="btn-primary flex items-center space-x-3 w-full md:w-auto justify-center">
                        {loading ? (
                            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div><span>Processing...</span></>
                        ) : (
                            <><span>Submit Enrollment</span><span className="text-xl">➔</span></>
                        )}
                    </button>
                </div>
            </form>

            {/* AI CHATBOT WIDGET */}
            <div className="fixed bottom-8 right-8 z-50">
                {!showChat ? (
                    <button
                        onClick={() => setShowChat(true)}
                        className="bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl hover:bg-slate-800 transition-all duration-300 flex items-center space-x-3 group active:scale-95"
                    >
                        <div className="bg-indigo-500 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                        </div>
                        <span className="font-bold tracking-tight">Support AI</span>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    </button>
                ) : (
                    <div className="bg-white w-[22rem] h-[30rem] rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col overflow-hidden animate-slide-up">
                        <div className="bg-slate-900 p-6 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full"></div>
                            <div className="relative z-10 flex items-center space-x-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">✨</div>
                                <div>
                                    <h4 className="font-bold text-sm leading-tight text-white">Form Assistant</h4>
                                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">AI Agent Online</span>
                                </div>
                            </div>
                            <button onClick={() => setShowChat(false)} className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-colors">✕</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all ${msg.sender === 'user' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 ml-8' : 'bg-white border text-slate-700 shadow-sm mr-8'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t bg-white flex space-x-2">
                            <input
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                                placeholder="Type your doubt..."
                                className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                            />
                            <button type="submit" className="bg-indigo-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-indigo-700 active:scale-90 transition-all">➤</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnquiryForm;
