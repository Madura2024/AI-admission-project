const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');
const fs = require('fs');

// Helper to ensure directory exists
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// ==========================================
// 1. Create Application (Start)
// POST /api/admission/create
// ==========================================
router.post('/create', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const random4 = Math.floor(1000 + Math.random() * 9000);
        const application_no = `APP${currentYear}${random4}`;

        // Create initial record in applications table
        await db.query(
            "INSERT INTO applications (application_no, status) VALUES ($1, 'draft') RETURNING application_no",
            [application_no]
        );

        // Also create initial empty records in other tables to simplify updates? 
        // Or just wait for updates. Upsert is safer.
        // Let's stick to simple INSERT/UPDATE logic or UPSERT in steps.

        res.json({ success: true, application_no });
    } catch (err) {
        console.error("Create Application Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// 2. Upload Files (Photo, Signature, Docs)
// POST /api/admission/upload
// ==========================================
router.post('/upload', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }

        const { application_no, doc_type } = req.body; // doc_type: 'candidate_photo', 'candidate_sign', etc.
        if (!application_no || !doc_type) return res.status(400).json({ error: "Missing metadata" });

        const uploadedFile = req.files.file;
        const fileExt = path.extname(uploadedFile.name);
        const fileName = `${application_no}_${doc_type}_${Date.now()}${fileExt}`;
        const uploadDir = path.join(__dirname, '../uploads');

        ensureDir(uploadDir);

        const filePath = path.join(uploadDir, fileName);

        uploadedFile.mv(filePath, async (err) => {
            if (err) return res.status(500).json({ error: err });

            const fileUrl = `/uploads/${fileName}`;

            // Store in uploaded_documents table
            await db.query(
                "INSERT INTO uploaded_documents (application_no, document_type, file_path) VALUES ($1, $2, $3)",
                [application_no, doc_type, fileUrl]
            );

            res.json({ success: true, url: fileUrl });
        });
    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// 3. Save Step 1: Personal Details
// POST /api/admission/step1
// ==========================================
router.post('/step1', async (req, res) => {
    try {
        const { application_no, ...data } = req.body;

        // Check if exists
        const check = await db.query("SELECT id FROM personal_details WHERE application_no = $1", [application_no]);

        if (check.rows.length > 0) {
            // Update
            const query = `
                UPDATE personal_details SET 
                full_name=$1, photo_url=$2, aadhar_number=$3, gender=$4, dob=$5, age=$6, 
                religion=$7, nationality=$8, community=$9, caste=$10, blood_group=$11, 
                whatsapp_no=$12, email=$13, native=$14
                WHERE application_no=$15
            `;
            const values = [
                data.full_name, data.photo_url, data.aadhar_number, data.gender, data.dob, data.age,
                data.religion, data.nationality, data.community, data.caste, data.blood_group,
                data.whatsapp_no, data.email, data.native, application_no
            ];
            await db.query(query, values);
        } else {
            // Insert
            const query = `
                INSERT INTO personal_details (
                    application_no, full_name, photo_url, aadhar_number, gender, dob, age,
                    religion, nationality, community, caste, blood_group, whatsapp_no, email, native
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            `;
            const values = [
                application_no, data.full_name, data.photo_url, data.aadhar_number, data.gender,
                data.dob, data.age, data.religion, data.nationality, data.community,
                data.caste, data.blood_group, data.whatsapp_no, data.email, data.native
            ];
            await db.query(query, values);
        }
        res.json({ success: true });
    } catch (err) {
        console.error("Step 1 Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 4. Save Step 2: Parent Details
// POST /api/admission/step2
// ==========================================
router.post('/step2', async (req, res) => {
    try {
        const { application_no, ...data } = req.body;
        const check = await db.query("SELECT id FROM parent_details WHERE application_no = $1", [application_no]);

        if (check.rows.length > 0) {
            const query = `
                UPDATE parent_details SET 
                father_name=$1, father_photo_url=$2, father_sign_url=$3, 
                mother_name=$4, mother_photo_url=$5, mother_sign_url=$6, 
                annual_income=$7, student_mobile=$8, father_mobile=$9, mother_mobile=$10, office_address=$11
                WHERE application_no=$12
            `;
            const values = [
                data.father_name, data.father_photo_url, data.father_sign_url,
                data.mother_name, data.mother_photo_url, data.mother_sign_url,
                data.annual_income, data.student_mobile, data.father_mobile, data.mother_mobile, data.office_address,
                application_no
            ];
            await db.query(query, values);
        } else {
            const query = `
                INSERT INTO parent_details (
                    application_no, father_name, father_photo_url, father_sign_url,
                    mother_name, mother_photo_url, mother_sign_url, annual_income,
                    student_mobile, father_mobile, mother_mobile, office_address
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            `;
            const values = [
                application_no, data.father_name, data.father_photo_url, data.father_sign_url,
                data.mother_name, data.mother_photo_url, data.mother_sign_url, data.annual_income,
                data.student_mobile, data.father_mobile, data.mother_mobile, data.office_address
            ];
            await db.query(query, values);
        }
        res.json({ success: true });
    } catch (err) {
        console.error("Step 2 Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 5. Save Step 3: Address Details
// POST /api/admission/step3
// ==========================================
router.post('/step3', async (req, res) => {
    try {
        const { application_no, ...data } = req.body;
        const check = await db.query("SELECT id FROM address_details WHERE application_no = $1", [application_no]);

        if (check.rows.length > 0) {
            const query = `
                UPDATE address_details SET 
                perm_state=$1, perm_pincode=$2, comm_state=$3, comm_pincode=$4
                WHERE application_no=$5
            `;
            await db.query(query, [data.perm_state, data.perm_pincode, data.comm_state, data.comm_pincode, application_no]);
        } else {
            const query = `
                INSERT INTO address_details (application_no, perm_state, perm_pincode, comm_state, comm_pincode)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await db.query(query, [application_no, data.perm_state, data.perm_pincode, data.comm_state, data.comm_pincode]);
        }
        res.json({ success: true });
    } catch (err) {
        console.error("Step 3 Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 6. Save Step 4: Academic Details
// POST /api/admission/step4
// ==========================================
router.post('/step4', async (req, res) => {
    try {
        const { application_no, ...data } = req.body;
        const check = await db.query("SELECT id FROM academic_records WHERE application_no = $1", [application_no]);

        if (check.rows.length > 0) {
            const query = `
                UPDATE academic_records SET 
                x_month_year=$1, x_register_no=$2, x_school_name=$3, x_board=$4,
                hsc_month_year=$5, hsc_register_no=$6, hsc_school_name=$7, hsc_board=$8, hsc_medium=$9,
                maths_marks=$10, physics_theory=$11, physics_practical=$12, chemistry_theory=$13, chemistry_practical=$14, vocational_theory=$15,
                attempts=$16, total_marks_100=$17, cutoff_200=$18,
                college_name=$19, university=$20, passing_month_year=$21, percentage_cgpa=$22, arrears_count=$23,
                school_type=$24, marks_11th_total=$25
                WHERE application_no=$26
            `;
            const values = [
                data.x_month_year, data.x_register_no, data.x_school_name, data.x_board,
                data.hsc_month_year, data.hsc_register_no, data.hsc_school_name, data.hsc_board, data.hsc_medium,
                data.maths_marks, data.physics_theory, data.physics_practical, data.chemistry_theory, data.chemistry_practical, data.vocational_theory,
                data.attempts, data.total_marks_100, data.cutoff_200,
                data.college_name, data.university, data.passing_month_year, data.percentage_cgpa, data.arrears_count,
                data.school_type, data.marks_11th_total, application_no
            ];
            await db.query(query, values);
        } else {
            const query = `
                INSERT INTO academic_records (
                     application_no, x_month_year, x_register_no, x_school_name, x_board,
                     hsc_month_year, hsc_register_no, hsc_school_name, hsc_board, hsc_medium,
                     maths_marks, physics_theory, physics_practical, chemistry_theory, chemistry_practical, vocational_theory,
                     attempts, total_marks_100, cutoff_200,
                     college_name, university, passing_month_year, percentage_cgpa, arrears_count,
                     school_type, marks_11th_total
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
            `;
            const values = [
                application_no, data.x_month_year, data.x_register_no, data.x_school_name, data.x_board,
                data.hsc_month_year, data.hsc_register_no, data.hsc_school_name, data.hsc_board, data.hsc_medium,
                data.maths_marks, data.physics_theory, data.physics_practical, data.chemistry_theory, data.chemistry_practical, data.vocational_theory,
                data.attempts, data.total_marks_100, data.cutoff_200,
                data.college_name, data.university, data.passing_month_year, data.percentage_cgpa, data.arrears_count,
                data.school_type, data.marks_11th_total
            ];
            await db.query(query, values);
        }
        res.json({ success: true });
    } catch (err) {
        console.error("Step 4 Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 7. Save Step 5: Admission Details
// POST /api/admission/step5
// ==========================================
router.post('/step5', async (req, res) => {
    try {
        const { application_no, ...data } = req.body;
        const check = await db.query("SELECT id FROM admission_details WHERE application_no = $1", [application_no]);

        if (check.rows.length > 0) {
            const query = `
                UPDATE admission_details SET 
                admission_type=$1, allotment_no=$2, quota=$3, admitted_branch=$4,
                hostel_required=$5, transport_required=$6, boarding_point=$7
                WHERE application_no=$8
            `;
            const values = [
                data.admission_type, data.allotment_no, data.quota, data.admitted_branch,
                data.hostel_required, data.transport_required, data.boarding_point,
                application_no
            ];
            await db.query(query, values);
        } else {
            const query = `
                INSERT INTO admission_details (application_no, admission_type, allotment_no, quota, admitted_branch, hostel_required, transport_required, boarding_point)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `;
            const values = [
                application_no, data.admission_type, data.allotment_no, data.quota, data.admitted_branch,
                data.hostel_required, data.transport_required, data.boarding_point
            ];
            await db.query(query, values);
        }
        res.json({ success: true });
    } catch (err) {
        console.error("Step 5 Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 8. Submit Final Application
// POST /api/admission/submit
// ==========================================
const { sendSMS } = require('../utils/smsService'); // Import SMS Service

// ...

router.post('/submit', async (req, res) => {
    try {
        const { application_no } = req.body;
        // Mark status as submitted
        await db.query("UPDATE applications SET status='submitted', updated_at=datetime('now') WHERE application_no=$1", [application_no]);

        // Fetch user details for SMS
        const userRes = await db.query("SELECT full_name, whatsapp_no FROM personal_details WHERE application_no=$1", [application_no]);

        if (userRes.rows.length > 0) {
            const { full_name, whatsapp_no } = userRes.rows[0];
            if (whatsapp_no) {
                sendSMS(whatsapp_no, `Dear ${full_name}, Your admission application (${application_no}) has been successfully submitted. We will review it shortly.`);
            }
        }

        res.json({ success: true });
    } catch (err) {
        console.error("Submit Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 9. Get Full Application (For Admin / View)
// GET /api/admission/:id
// ==========================================
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const app = await db.query("SELECT * FROM applications WHERE application_no=$1", [id]);
        if (app.rows.length === 0) return res.status(404).json({ error: "Application not found" });

        const personal = await db.query("SELECT * FROM personal_details WHERE application_no=$1", [id]);
        const parent = await db.query("SELECT * FROM parent_details WHERE application_no=$1", [id]);
        const address = await db.query("SELECT * FROM address_details WHERE application_no=$1", [id]);
        const academic = await db.query("SELECT * FROM academic_records WHERE application_no=$1", [id]);
        const admission = await db.query("SELECT * FROM admission_details WHERE application_no=$1", [id]);
        const docs = await db.query("SELECT * FROM uploaded_documents WHERE application_no=$1", [id]);

        res.json({
            application: app.rows[0],
            personal: personal.rows[0] || {},
            parent: parent.rows[0] || {},
            address: address.rows[0] || {},
            academic: academic.rows[0] || {},
            admission: admission.rows[0] || {},
            documents: docs.rows || []
        });

    } catch (err) {
        console.error("Get Application Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 10. Get All Applications (For Admin)
// GET /api/admission
// ==========================================
router.get('/', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM applications ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("Get All Apps Error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
