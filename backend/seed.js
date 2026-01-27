const db = require('./db');

const { courses } = require('./utils/initial_data');

async function seedData() {
    try {
        console.log("Seeding Database...");

        // Seed Admin (if not exists)
        const userRes = await db.query("SELECT * FROM users WHERE email = 'admin@college.com'");
        if (userRes.rows.length === 0) {
            await db.query("INSERT INTO users (name, email, password_hash, role) VALUES ('Admin', 'admin@college.com', 'admin123', 'admin')");
            console.log("Admin user created");
        } else {
            console.log("Admin user already exists");
        }

        // Seed Courses (Reset and Re-seed)
        try { await db.query("DELETE FROM courses"); } catch (e) { }
        try { await db.query("DELETE FROM sqlite_sequence WHERE name='courses'"); } catch (e) { }

        for (const course of courses) {
            await db.query(
                "INSERT INTO courses (course_name, stream, fees, eligibility, type) VALUES ($1, $2, $3, $4, $5)",
                [course.name, course.stream, course.fees, course.eligibility, course.type]
            );
        }
        console.log(`Seeded ${courses.length} courses.`);

        console.log("Seeding Completed.");
        process.exit();
    } catch (e) {
        console.error("Seeding Error:", e);
        process.exit(1);
    }
}

seedData();
