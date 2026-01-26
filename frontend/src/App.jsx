import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import EnquiryForm from './pages/EnquiryForm'
import CourseList from './pages/CourseList'
import AdmissionForm from './pages/AdmissionForm'
import StatusTracking from './pages/StatusTracking'
import AdminDashboard from './pages/AdminDashboard'
import Home from './pages/Home'
import HowToUse from './pages/HowToUse'
import SystemWalkthrough from './pages/SystemWalkthrough'
import Navbar from './components/Navbar'

function App() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4 pt-24">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/enquiry" element={<EnquiryForm />} />
                    <Route path="/courses" element={<CourseList />} />
                    <Route path="/admission" element={<AdmissionForm />} />
                    <Route path="/status" element={<StatusTracking />} />
                    <Route path="/how-to-use" element={<HowToUse />} />
                    <Route path="/walkthrough" element={<SystemWalkthrough />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </div>
        </div>
    )
}

export default App
