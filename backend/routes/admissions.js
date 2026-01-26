const express = require('express');
const router = express.Router();
const db = require('../db');

// Submit Admission
router.post('/', async (req, res) => {
    try {
        const { application_no, selected_course, documents_url } = req.body;

        // Check if valid application
        const enquiryCheck = await db.query('SELECT * FROM enquiries WHERE application_no = $1', [application_no]);
        if (enquiryCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Invalid Application Number' });
        }

        // Create Admission Record
        await db.query(
            'INSERT INTO admissions (application_no, selected_course, documents_url, status) VALUES ($1, $2, $3, $4)',
            [application_no, selected_course, documents_url, 'pending']
        );

        res.status(201).json({ message: 'Admission application submitted successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Track Status
router.get('/status/:application_no', async (req, res) => {
    try {
        const { application_no } = req.params;
        const result = await db.query('SELECT * FROM admissions WHERE application_no = $1', [application_no]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Admission details not found for this number' });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Get all applications
router.get('/all', async (req, res) => {
    try {
        // ideally protected route
        const result = await db.query(`
            SELECT a.*, e.student_name, e.marks 
            FROM admissions a
            JOIN enquiries e ON a.application_no = e.application_no
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Admission Status
router.post('/process/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const isDemo = req.query.demo === 'true';

        await db.query('UPDATE admissions SET status = $1 WHERE id = $2', [status, id]);

        // Demo Mode Logic
        if (isDemo && status === 'approved') {
            console.log(`[DEMO] Application ${id} approved instantly. No Email/SMS sent.`);
        } else if (status === 'approved') {
            console.log(`[REAL] Sending Admission Confirmation Email to student...`);
            // Trigger Email Service logic here
        }

        res.json({ message: 'Status updated' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
