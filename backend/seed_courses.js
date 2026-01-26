const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'admission.sqlite');
const db = new sqlite3.Database(dbPath);

const courses = [
  // --- UG (Regular) ---
  {
    course_name: 'B.E - Computer Science and Engineering',
    type: 'UG',
    stream: 'Engineering',
    fees: 150000,
    eligibility: '12th Science with > 60%',
    duration: '4 Years',
    intake: '120 Seats'
  },
  {
    course_name: 'B.E - Electronics & Communication Engineering',
    type: 'UG',
    stream: 'Engineering',
    fees: 150000,
    eligibility: '12th Science with > 60%',
    duration: '4 Years',
    intake: '120 Seats'
  },
  {
    course_name: 'B.E - Mechanical Engineering',
    type: 'UG',
    stream: 'Engineering',
    fees: 150000,
    eligibility: '12th Science with > 60%',
    duration: '4 Years',
    intake: '60 Seats'
  },
  {
    course_name: 'B.Tech - Artificial Intelligence and Data Science',
    type: 'UG',
    stream: 'Engineering',
    fees: 150000,
    eligibility: '12th Science with > 60%',
    duration: '4 Years',
    intake: '120 Seats'
  },
  {
    course_name: 'B.Tech - Information Technology',
    type: 'UG',
    stream: 'Engineering',
    fees: 150000,
    eligibility: '12th Science with > 60%',
    duration: '4 Years',
    intake: '120 Seats'
  },

  // --- UG (Lateral Entry) ---
  // Usually same courses but different eligibility/duration
  {
    course_name: 'B.E - Computer Science (Lateral)',
    type: 'Lateral',
    stream: 'Engineering',
    fees: 145000,
    eligibility: 'Diploma in CS/IT with > 60%',
    duration: '3 Years',
    intake: '12 Seats' // Usually 10% of intake
  },
  {
    course_name: 'B.E - Mechanical (Lateral)',
    type: 'Lateral',
    stream: 'Engineering',
    fees: 145000,
    eligibility: 'Diploma in Mech with > 60%',
    duration: '3 Years',
    intake: '6 Seats'
  },
  {
    course_name: 'B.E - ECE (Lateral)',
    type: 'Lateral',
    stream: 'Engineering',
    fees: 145000,
    eligibility: 'Diploma in ECE with > 60%',
    duration: '3 Years',
    intake: '12 Seats'
  },

  // --- PG ---
  {
    course_name: 'M.E - Computer Science and Engineering',
    type: 'PG',
    stream: 'Engineering',
    fees: 100000,
    eligibility: 'B.E/B.Tech in CS/IT',
    duration: '2 Years',
    intake: '18 Seats'
  },
  {
    course_name: 'M.B.A - Master of Business Administration',
    type: 'PG',
    stream: 'Management',
    fees: 200000,
    eligibility: 'Any Degree',
    duration: '2 Years',
    intake: '60 Seats'
  }
];

db.serialize(() => {
  console.log("Starting Course Update...");

  // 1. Drop existing table to force schema update to include 'type'
  db.run("DROP TABLE IF EXISTS courses", (err) => {
    if (err) console.error("Error dropping table:", err);
    else console.log("Dropped existing courses table.");

    // 2. Re-create table with new 'type' column
    db.run(`
            CREATE TABLE courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                course_name TEXT,
                type TEXT,
                stream TEXT,
                fees INTEGER,
                eligibility TEXT,
                duration TEXT,
                intake TEXT
            )
        `, (err) => {
      if (err) {
        console.error("Error creating table:", err);
        process.exit(1);
      } else {
        console.log("Created courses table with new 'type' column.");

        // 3. Insert Data
        const stmt = db.prepare("INSERT INTO courses (course_name, type, stream, fees, eligibility, duration, intake) VALUES (?, ?, ?, ?, ?, ?, ?)");

        courses.forEach(c => {
          stmt.run(c.course_name, c.type, c.stream, c.fees, c.eligibility, c.duration, c.intake, (err) => {
            if (err) console.error(`Failed to insert ${c.course_name}:`, err);
            else console.log(`Inserted: ${c.course_name} [${c.type}]`);
          });
        });

        stmt.finalize(() => {
          console.log("All courses inserted successfully!");
          db.close();
        });
      }
    });
  });
});
