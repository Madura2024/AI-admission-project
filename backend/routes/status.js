const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/status/:application_no
router.get('/:application_no', async (req, res) => {
    try {
        const { application_no } = req.params;

        // Check main application table
        const appResult = await db.query("SELECT * FROM applications WHERE application_no=$1", [application_no]);

        if (appResult.rows.length === 0) {
            // Fallback check: maybe it's just an enquiry?
            const enqResult = await db.query("SELECT * FROM enquiries WHERE application_no=$1", [application_no]);
            if (enqResult.rows.length > 0) {
                return res.json({
                    application_no,
                    status: 'Enquiry Submitted',
                    selected_course: enqResult.rows[0].course || 'General',
                    created_at: enqResult.rows[0].created_at
                });
            }
            return res.status(404).json({ message: "No application found with this number." });
        }

        const appData = appResult.rows[0];

        // Fetch selected course from admission details if available
        let courseName = "Not Selected";
        const admResult = await db.query("SELECT admitted_branch FROM admission_details WHERE application_no=$1", [application_no]);
        if (admResult.rows.length > 0) {
            courseName = admResult.rows[0].admitted_branch || "Processing";
        }

        res.json({
            application_no: appData.application_no,
            status: appData.status,
            selected_course: courseName,
            created_at: appData.created_at
        });

    } catch (err) {
        console.error("Status Check Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
