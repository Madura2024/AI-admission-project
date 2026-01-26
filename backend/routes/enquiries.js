const express = require('express');
const router = express.Router();
const db = require('../db');
const axios = require('axios');

// Create Enquiry & Get Recommendation
// Create Enquiry & Get Recommendation
// POST /api/enquiry - Submit/Auto-save Enquiry
router.post('/', async (req, res) => {
    try {
        console.log("Enquiry payload:", req.body);
        const data = req.body;
        let { application_no } = data;

        const isDemo = req.query.demo === 'true';

        // 1. Generate Application Number if not provided (Initial Save)
        if (!application_no) {
            const currentYear = new Date().getFullYear();
            const random4 = Math.floor(1000 + Math.random() * 9000);
            const prefix = isDemo ? 'DEMO' : 'APP';
            application_no = `${prefix}${currentYear}${random4}`;
        }

        // 2. Upsert Logic (Insert or Update)
        const check = await db.query("SELECT id FROM enquiries WHERE application_no = $1", [application_no]);

        if (check.rows.length > 0) {
            // UPDATE
            const query = `
                UPDATE enquiries SET 
                institution=$1, course=$2, student_name=$3, gender=$4, dob=$5, aadhar_no=$6, 
                quota=$7, father_name=$8, father_occupation=$9, mother_name=$10, mother_occupation=$11, 
                annual_income=$12, community=$13, address=$14, pincode=$15, phone_1=$16, phone_2=$17, 
                phone_3=$18, school_name_place=$19, school_type=$20, board_of_study=$21, 
                medium_of_instruction=$22, marks_10th_total=$23, marks_10th_maths=$24, 
                marks_10th_science=$25, marks_11th_total=$26, marks_11th_phy_eco=$27, 
                marks_11th_che_comm=$28, marks_11th_maths_accs=$29, marks_11th_comp_bio=$30, 
                marks_12th_total=$31, marks_12th_phy_eco=$32, marks_12th_che_comm=$33, 
                marks_12th_maths_accs=$34, marks_12th_comp_bio=$35, group_12th=$36, 
                reg_no_12th=$37, first_gen_graduate=$38, pmss=$39, laptop=$40, college_bus=$41, 
                bus_boarding_point=$42, hostel=$43, source=$44, city=$45, state=$46, email=$47
                WHERE application_no=$48
            `;
            const values = [
                data.institution, data.course, data.student_name, data.gender, data.dob, data.aadhar_no,
                data.quota, data.father_name, data.father_occupation, data.mother_name, data.mother_occupation,
                data.annual_income, data.community, data.address, data.pincode, data.phone_1, data.phone_2,
                data.phone_3, data.school_name_place, data.school_type, data.board_of_study,
                data.medium_of_instruction, data.marks_10th_total, data.marks_10th_maths,
                data.marks_10th_science, data.marks_11th_total, data.marks_11th_phy_eco,
                data.marks_11th_che_comm, data.marks_11th_maths_accs, data.marks_11th_comp_bio,
                data.marks_12th_total, data.marks_12th_phy_eco, data.marks_12th_che_comm,
                data.marks_12th_maths_accs, data.marks_12th_comp_bio, data.group_12th,
                data.reg_no_12th, data.first_gen_graduate, data.pmss, data.laptop, data.college_bus,
                data.bus_boarding_point, data.hostel, data.source, data.city, data.state, data.email, application_no
            ];
            await db.query(query, values);
        } else {
            // INSERT
            const query = `
                INSERT INTO enquiries (
                    application_no, institution, course, student_name, gender, dob, aadhar_no,
                    quota, father_name, father_occupation, mother_name, mother_occupation,
                    annual_income, community, address, pincode, phone_1, phone_2, phone_3,
                    school_name_place, school_type, board_of_study, medium_of_instruction,
                    marks_10th_total, marks_10th_maths, marks_10th_science, marks_11th_total,
                    marks_11th_phy_eco, marks_11th_che_comm, marks_11th_maths_accs,
                    marks_11th_comp_bio, marks_12th_total, marks_12th_phy_eco,
                    marks_12th_che_comm, marks_12th_maths_accs, marks_12th_comp_bio,
                    group_12th, reg_no_12th, first_gen_graduate, pmss, laptop,
                    college_bus, bus_boarding_point, hostel, source, city, state, email
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19,
                    $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36,
                    $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48
                )
            `;
            const values = [
                application_no, data.institution, data.course, data.student_name, data.gender, data.dob, data.aadhar_no,
                data.quota, data.father_name, data.father_occupation, data.mother_name, data.mother_occupation,
                data.annual_income, data.community, data.address, data.pincode, data.phone_1, data.phone_2, data.phone_3,
                data.school_name_place, data.school_type, data.board_of_study, data.medium_of_instruction,
                data.marks_10th_total, data.marks_10th_maths, data.marks_10th_science, data.marks_11th_total,
                data.marks_11th_phy_eco, data.marks_11th_che_comm, data.marks_11th_maths_accs,
                data.marks_11th_comp_bio, data.marks_12th_total, data.marks_12th_phy_eco,
                data.marks_12th_che_comm, data.marks_12th_maths_accs, data.marks_12th_comp_bio,
                data.group_12th, data.reg_no_12th, data.first_gen_graduate, data.pmss, data.laptop,
                data.college_bus, data.bus_boarding_point, data.hostel, data.source, data.city, data.state, data.email
            ];
            await db.query(query, values);

            // Send SMS only on initial successful insert (if not demo)
            if (!isDemo && data.phone_1) {
                try {
                    const { sendSMS } = require('../utils/smsService');
                    sendSMS(data.phone_1, `Dear ${data.student_name}, Thank you for your enquiry at KGiSL. Your Ref No is ${application_no}.`);
                } catch (smsErr) { console.error("SMS skip/fail", smsErr); }
            }
        }

        // Recommendation logic (calculated on 12th marks)
        let recommendation = "Arts";
        const totalMarks = parseFloat(data.marks_12th_total) || 0;
        if (totalMarks > 450) recommendation = "Engineering (Top Stream)";
        else if (totalMarks > 350) recommendation = "Engineering";
        else if (totalMarks > 250) recommendation = "Science";

        res.status(check.rows.length > 0 ? 200 : 211).json({
            success: true,
            message: check.rows.length > 0 ? 'Draft saved' : 'Enquiry submitted',
            application_no,
            recommendation
        });

    } catch (err) {
        console.error("Enquiry API Error:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/enquiry - Get All Enquiries
router.get('/', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM enquiries ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("Get Enquiries Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});



module.exports = router;
