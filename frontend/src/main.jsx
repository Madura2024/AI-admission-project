import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { DemoProvider } from './context/DemoContext'
import { AdmissionProvider } from './context/AdmissionContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <DemoProvider>
                <AdmissionProvider>
                    <App />
                </AdmissionProvider>
            </DemoProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
