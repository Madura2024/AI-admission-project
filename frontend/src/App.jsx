import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import EnquiryForm from './pages/EnquiryForm'
import CourseList from './pages/CourseList'
import AdmissionForm from './pages/AdmissionForm'
import AdmissionSuccess from './pages/AdmissionSuccess'
import StatusTracking from './pages/StatusTracking'
import AdminDashboard from './pages/AdminDashboard'
import Home from './pages/Home'
import HowToUse from './pages/HowToUse'
import SystemWalkthrough from './pages/SystemWalkthrough'
import EnquiryData from './pages/EnquiryData'
import ApplicationData from './pages/ApplicationData'
import Navbar from './components/Navbar'
import ChatBot from './components/ChatBot'

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
                    <Route path="/admission-success" element={<AdmissionSuccess />} />
                    <Route path="/status" element={<StatusTracking />} />
                    <Route path="/how-to-use" element={<HowToUse />} />
                    <Route path="/walkthrough" element={<SystemWalkthrough />} />
                    <Route path="/enquiry-data" element={<EnquiryData />} />
                    <Route path="/application-data" element={<ApplicationData />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </div>
            <ChatBot />
        </div>
    )
}

export default App
