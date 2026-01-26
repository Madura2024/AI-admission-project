const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const db = require('./db');
const axios = require('axios');
require('dotenv').config();

// Start Background Jobs
require('./jobs/reminderJob');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/courses', require('./routes/courses'));
app.use('/api/enquiry', require('./routes/enquiries'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admission', require('./routes/admission')); // Handles both form and admission logic if consolidated, otherwise check files
// app.use('/api/status', require('./routes/status')); // Check if this file exists and is separate

// ==========================================
// API 2 – AI Course Recommendation
// POST /api/recommend
// ==========================================
app.post('/api/recommend', async (req, res) => {
    try {
        console.log("API 2: Recommend Request", req.body);
        const { marks } = req.body;

        // Logic: if marks > 80 → Engineering; if marks > 60 → Science; else → Arts
        let recommended_stream = "Arts";
        if (marks > 80) recommended_stream = "Engineering";
        else if (marks > 60) recommended_stream = "Science";

        res.json({ recommended_stream });
    } catch (err) {
        console.error("Recommend Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// API 3 & 4 - Admission & Status
// MOVED TO: routes/admission.js and routes/status.js (to be created if needed)
// Note: We are using /api/admission for admission related operations.
// ==========================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
