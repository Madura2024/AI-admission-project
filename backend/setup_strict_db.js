const db = require('./db');
require('dotenv').config();

const setupStrict = async () => {
    try {
        console.log("Setting up STRICT Database Schema...");

        // 1. Enquiries Table
        await db.query(`DROP TABLE IF EXISTS enquiries CASCADE`);
        await db.query(`
            CREATE TABLE enquiries (
                application_no VARCHAR(30) PRIMARY KEY,
                student_name TEXT,
                email TEXT,
                phone TEXT,
                qualification TEXT,
                marks INT,
                interested_stream TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Created table: enquiries");

        // 2. Admissions Table
        await db.query(`DROP TABLE IF EXISTS admissions CASCADE`);
        await db.query(`
            CREATE TABLE admissions (
                application_no VARCHAR(30) PRIMARY KEY,
                selected_course TEXT,
                document_name TEXT,
                status TEXT DEFAULT 'pending'
            );
        `);
        console.log("Created table: admissions");

        console.log("Strict Schema Setup Complete.");
        process.exit(0);
    } catch (err) {
        console.error("Setup Failed:", err);
        process.exit(1);
    }
};

setupStrict();
