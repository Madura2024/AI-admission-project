import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CourseList = () => {
    // Initialize as empty array to prevent map undefined error
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('UG'); // Default type
    const navigate = useNavigate();

    // Mapping for user-friendly labels
    const typeLabels = {
        'UG': 'UG (Regular)',
        'Lateral': 'UG (Lateral Entry)',
        'PG': 'PG (Master\'s)'
    };

    useEffect(() => {
        setLoading(true);
        api.get(`/api/courses?type=${selectedType}`)
            .then(res => {
                console.log("Course Data:", res.data);
                if (Array.isArray(res.data)) {
                    setCourses(res.data);
                } else {
                    console.error("Invalid data format received:", res.data);
                    setCourses([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                setError("Failed to load courses. Is backend running?");
                setLoading(false);
            });
    }, [selectedType]); // Re-fetch when type changes

    const handleSelect = (course) => {
        localStorage.setItem("selected_course", course.course_name);
        localStorage.setItem("admission_type", course.type); // Store type for admission flow
        navigate('/admission');
    };

    if (loading) return <div className="text-center p-10 font-bold text-gray-600">Loading Courses...</div>;
    if (error) return <div className="text-center p-10 text-red-600 font-bold">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto py-16 px-4">
            <div className="text-center mb-16 animate-fade-in">
                <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                    Explore Our <span className="text-gradient">Academics</span>
                </h2>
                <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
                    Choose from our wide range of industry-aligned programs designed to shape the future of technology and management.
                </p>
            </div>

            {/* Premium Tabs */}
            <div className="flex justify-center mb-12 p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-[2rem] max-w-xl mx-auto border border-slate-200/60 transition-all duration-500">
                {Object.keys(typeLabels).map(type => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`flex-1 px-8 py-3.5 rounded-[1.8rem] font-bold text-sm transition-all duration-500 ${selectedType === type
                            ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-100 ring-1 ring-slate-100 scale-100'
                            : 'text-slate-500 hover:text-indigo-500 hover:bg-white/50'
                            }`}
                    >
                        {typeLabels[type]}
                    </button>
                ))}
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-20 premium-card bg-slate-50 border-dashed border-slate-300">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-slate-500 font-bold">No courses found in this category.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {courses.map(course => (
                        <div key={course.id} className="premium-card p-0 overflow-hidden flex flex-col group h-full">
                            <div className="h-4 bg-gradient-to-r from-indigo-500 to-violet-500 w-full"></div>
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full ring-1 ring-indigo-100">
                                        {course.stream}
                                    </span>
                                    <div className="flex -space-x-1">
                                        {[1, 2, 3].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-slate-100 border border-white"></div>)}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-extrabold text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300 leading-tight">
                                    {course.course_name}
                                </h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center text-sm font-bold text-slate-600">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3">⏱</div>
                                        <span>Duration: {course.duration || '4 Years Program'}</span>
                                    </div>
                                    <div className="flex items-center text-sm font-bold text-slate-600">
                                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mr-3">🎟</div>
                                        <span>Capacity: {course.intake || '60 Seats Available'}</span>
                                    </div>
                                    <div className="flex items-start text-sm font-medium text-slate-500">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 shrink-0">ℹ</div>
                                        <p className="pt-1">{course.eligibility}</p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">Annual Fee</p>
                                        <p className="text-2xl font-black text-slate-900 tabular-nums">
                                            ₹{course.fees ? course.fees.toLocaleString('en-IN') : '--'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleSelect(course)}
                                        className="bg-indigo-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:bg-slate-900 hover:shadow-xl transition-all duration-300 group/btn"
                                    >
                                        <span className="text-xl group-hover/btn:translate-x-1 transition-transform">➔</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseList;
