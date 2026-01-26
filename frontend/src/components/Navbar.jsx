import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DemoToggle from './DemoToggle';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const NavLink = ({ to, children }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`text-sm font-medium transition-all duration-300 relative group ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
                    }`}
            >
                {children}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </Link>
        );
    };

    return (
        <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform shadow-lg">
                        E
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        EduAdmit AI
                    </span>
                </Link>

                <div className="flex items-center space-x-8">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/courses">Courses</NavLink>
                    <NavLink to="/enquiry">Enquiry</NavLink>

                    {/* Admission Dropdown */}
                    <div className="relative group">
                        <button className="text-sm font-medium text-gray-600 hover:text-indigo-600 flex items-center h-full py-2 transition-colors duration-300">
                            Admissions
                            <svg className="w-4 h-4 ml-1 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </button>
                        <div className="absolute left-0 mt-0 w-48 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0 border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => {
                                    localStorage.setItem('admission_type', 'UG');
                                    navigate('/courses?type=UG');
                                    window.location.reload(); // Force re-render of CourseList if already there
                                }}
                                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-gray-50"
                            >
                                Undergraduate (UG)
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.setItem('admission_type', 'PG');
                                    navigate('/courses?type=PG');
                                    window.location.reload();
                                }}
                                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-gray-50"
                            >
                                Postgraduate (PG)
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.setItem('admission_type', 'Lateral');
                                    navigate('/courses?type=Lateral');
                                    window.location.reload();
                                }}
                                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                                Lateral Entry
                            </button>
                        </div>
                    </div>

                    <NavLink to="/status">Status</NavLink>
                    <NavLink to="/how-to-use">Demo</NavLink>
                    {token && <NavLink to="/admin">Admin</NavLink>}
                </div>

                <div className="flex items-center space-x-6">
                    <div className="scale-90">
                        <DemoToggle />
                    </div>
                    {token ? (
                        <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium text-sm border border-red-200 px-4 py-2 rounded-full hover:bg-red-50 transition">Logout</button>
                    ) : (
                        <Link to="/login" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
