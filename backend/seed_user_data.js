const db = require('./db');
require('dotenv').config();

const seedData = async () => {
    try {
        console.log("Seeding User Data...");

        // 1. Modify Courses Table to accept String IDs
        console.log("Modifying Courses Table schema...");
        await db.query(`DROP TABLE IF EXISTS courses`);
        await db.query(`
            CREATE TABLE courses (
                course_id VARCHAR(50) PRIMARY KEY,
                course_name VARCHAR(100) NOT NULL,
                eligibility VARCHAR(255) NOT NULL,
                fees DECIMAL(10, 2) NOT NULL,
                stream VARCHAR(50) NOT NULL
            )
        `);

        // 2. Insert Courses
        const courses = [
            ['C001', 'B.E. Mechanical Engineering', '12th Sci + Math', 100000, 'Engineering'],
            ['C002', 'B.E. Computer Science', '12th Sci + Math', 120000, 'Engineering'],
            ['C003', 'B.Sc Physics', '12th Sci', 70000, 'Science'],
            ['C004', 'B.Sc Mathematics', '12th Sci', 65000, 'Science'],
            ['C005', 'B.A. English Literature', '12th Arts', 50000, 'Arts'],
            ['C006', 'Diploma Civil Engineering', '10th Pass', 40000, 'Engineering']
        ];

        for (const c of courses) {
            await db.query(
                `INSERT INTO courses (course_id, course_name, eligibility, fees, stream) VALUES ($1, $2, $3, $4, $5)`,
                c
            );
        }
        console.log(`Inserted ${courses.length} courses`);

        // 3. Insert Enquiries (Clear old ones first to avoid conflict on PK)
        // Note: Admissions reference enquiries, so we must clear admissions first if we clear enquiries.
        console.log("Clearing old data...");
        await db.query('DELETE FROM admissions');
        await db.query('DELETE FROM enquiries');

        const enquiries = [
            ['ADM20260001', 'Ravi Kumar', 'ravi@mail.com', '9876543210', '12th Std', 89, 'Science', '2026-01-10 09:12'],
            ['ADM20260002', 'Meena Devi', 'meena@mail.com', '8765432109', '12th Std', 73, 'Science', '2026-01-10 10:25'],
            ['ADM20260003', 'Aravind S', 'aravind@mail.com', '7654321098', '12th Std', 55, 'Arts', '2026-01-11 11:05'],
            ['ADM20260004', 'Priya G', 'priya@mail.com', '6543210987', 'Diploma', 67, 'Engineering', '2026-01-11 14:50'],
            ['ADM20260005', 'Karthik R', 'karthik@mail.com', '5432109876', '12th Std', 92, 'Science', '2026-01-12 08:30']
        ];

        for (const e of enquiries) {
            await db.query(
                `INSERT INTO enquiries (application_no, student_name, email, phone, qualification, marks, interested_stream, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                e
            );
        }
        console.log(`Inserted ${enquiries.length} enquiries`);

        // 4. Insert Admissions
        const admissions = [
            ['ADM20260001', 'C002', '/docs/ADM20260001.pdf', 'approved'],
            ['ADM20260002', 'C004', '/docs/ADM20260002.pdf', 'pending'],
            ['ADM20260003', 'C005', '/docs/ADM20260003.pdf', 'rejected'],
            ['ADM20260004', 'C001', '/docs/ADM20260004.pdf', 'approved']
        ];

        for (const a of admissions) {
            await db.query(
                `INSERT INTO admissions (application_no, selected_course, documents_url, status) VALUES ($1, $2, $3, $4)`,
                a
            );
        }
        console.log(`Inserted ${admissions.length} admissions`);

        console.log("Seeding Complete!");
        process.exit(0);

    } catch (err) {
        console.error("Seeding Failed:", err);
        process.exit(1);
    }
};

seedData();
