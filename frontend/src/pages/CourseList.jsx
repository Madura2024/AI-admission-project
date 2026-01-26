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
        <div className="container mx-auto py-10 px-4">
            <h2 className="text-3xl font-bold text-center mb-6 text-indigo-800">Available Courses</h2>

            {/* Tabs */}
            <div className="flex justify-center mb-8 space-x-4">
                {Object.keys(typeLabels).map(type => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-6 py-2 rounded-full font-semibold transition duration-300 ${selectedType === type
                                ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {typeLabels[type]}
                    </button>
                ))}
            </div>

            {courses.length === 0 ? (
                <div className="text-center text-gray-500">No courses available for {typeLabels[selectedType]}.</div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    {courses.map(course => (
                        <div key={course.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border border-indigo-50">
                            <div className="h-2 bg-indigo-500 rounded-t-md mb-4 w-1/3"></div>
                            <h3 className="text-xl font-bold mb-2 text-gray-800">{course.course_name}</h3>
                            <p className="text-gray-600 mb-2 text-sm uppercase tracking-wide">Stream: <span className="font-semibold text-indigo-600">{course.stream}</span></p>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full font-semibold">Duration: {course.duration || '4 Years'}</span>
                                <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full font-semibold">Intake: {course.intake || '60 Seats'}</span>
                            </div>
                            <p className="text-gray-600 mb-4 text-sm">{course.eligibility}</p>
                            <div className="flex justify-between items-center mt-4 border-t pt-4">
                                {/* Use toLocaleString for Indian currency format approx */}
                                <p className="text-indigo-800 font-bold text-lg">
                                    Total Fees: ₹{course.fees ? course.fees.toLocaleString('en-IN') : 'N/A'}
                                </p>
                                <button
                                    onClick={() => handleSelect(course)}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
                                >
                                    Select
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseList;
