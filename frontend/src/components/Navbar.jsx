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
        <nav className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl group-hover:rotate-[15deg] transition-all duration-500 shadow-xl shadow-indigo-100">
                        E
                    </div>
                    <span className="text-2xl font-black tracking-tight text-slate-800">
                        EduAdmit<span className="text-gradient">AI</span>
                    </span>
                </Link>

                <div className="hidden lg:flex items-center space-x-10">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/courses">Courses</NavLink>
                    <NavLink to="/enquiry">Enquiry</NavLink>

                    {/* Admission Dropdown */}
                    <div className="relative group/nav">
                        <button className="text-[13px] font-bold text-slate-500 hover:text-indigo-600 flex items-center h-full py-2 transition-all duration-300 uppercase tracking-widest">
                            Admissions
                            <svg className="w-4 h-4 ml-1 transition-transform group-hover/nav:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <div className="absolute left-0 mt-2 w-56 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-500 transform origin-top-left scale-95 group-hover/nav:scale-100 border border-slate-100 p-2 overflow-hidden">
                            <button
                                onClick={() => {
                                    localStorage.setItem('admission_type', 'UG');
                                    navigate('/courses?type=UG');
                                    window.location.reload();
                                }}
                                className="block w-full text-left px-5 py-3.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-2xl transition-all"
                            >
                                Undergraduate (UG)
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.setItem('admission_type', 'PG');
                                    navigate('/courses?type=PG');
                                    window.location.reload();
                                }}
                                className="block w-full text-left px-5 py-3.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-2xl transition-all"
                            >
                                Postgraduate (PG)
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.setItem('admission_type', 'Lateral');
                                    navigate('/courses?type=Lateral');
                                    window.location.reload();
                                }}
                                className="block w-full text-left px-5 py-3.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-2xl transition-all"
                            >
                                Lateral Entry
                            </button>
                        </div>
                    </div>

                    <NavLink to="/status">Status</NavLink>
                    {token && <NavLink to="/admin">Admin</NavLink>}
                </div>

                <div className="flex items-center space-x-6">
                    <div className="scale-75 hidden sm:block">
                        <DemoToggle />
                    </div>
                    {token ? (
                        <button onClick={handleLogout} className="bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-2xl transition-all">Sign Out</button>
                    ) : (
                        <Link to="/login" className="bg-slate-900 text-white px-7 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 transform hover:-translate-y-0.5 active:scale-95">User Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
