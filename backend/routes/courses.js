const express = require('express');
const router = express.Router();
const db = require('../db');

// Fallback data in case DB is down
const fallbackCourses = [
    { id: 1, course_name: 'B.E - Computer Science and Engineering', fees: 150000, eligibility: '12th Science with > 60%', stream: 'Engineering', duration: '4 Years', intake: '120 Seats' },
    { id: 2, course_name: 'B.E - Electronics & Communication Engineering', fees: 150000, eligibility: '12th Science with > 60%', stream: 'Engineering', duration: '4 Years', intake: '120 Seats' },
    { id: 3, course_name: 'B.E - Mechanical Engineering', fees: 150000, eligibility: '12th Science with > 60%', stream: 'Engineering', duration: '4 Years', intake: '60 Seats' },
    { id: 4, course_name: 'B.Tech - Artificial Intelligence and Data Science', fees: 150000, eligibility: '12th Science with > 60%', stream: 'Engineering', duration: '4 Years', intake: '120 Seats' },
    { id: 5, course_name: 'B.Tech - Computer Science and Business Systems', fees: 150000, eligibility: '12th Science with > 60%', stream: 'Engineering', duration: '4 Years', intake: '60 Seats' },
    { id: 6, course_name: 'B.Tech - Information Technology', fees: 150000, eligibility: '12th Science with > 60%', stream: 'Engineering', duration: '4 Years', intake: '120 Seats' },
    { id: 7, course_name: 'B.E CSE (Cyber Security)', fees: 150000, eligibility: '12th Science with > 60%', stream: 'Engineering', duration: '4 Years', intake: '60 Seats' },
    { id: 8, course_name: 'B.E CSE (AI & ML)', fees: 150000, eligibility: '12th Science with > 60%', stream: 'Engineering', duration: '4 Years', intake: '120 Seats' },
    { id: 9, course_name: 'B.E - Robotics and Automation', fees: 150000, eligibility: '12th Science with > 60%', stream: 'Engineering', duration: '4 Years', intake: '60 Seats' }
];

router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        let query = 'SELECT * FROM courses';
        const params = [];

        if (type) {
            query += ' WHERE type = $1';
            params.push(type);
        }

        console.log("Fetching courses with query:", query, params);
        const result = await db.query(query, params);

        // Return raw DB rows (fees are now managed by seed script per type)
        // Previous Force 150000 logic is removed to allow PG/Lateral fees
        res.json(result.rows);
    } catch (err) {
        console.error("Database Error:", err);
        // Fallback logic
        const filteredFallback = type
            ? fallbackCourses.filter(c => (c.type || 'UG') === type)
            : fallbackCourses;
        res.json(filteredFallback);
    }
});

module.exports = router;
