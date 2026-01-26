const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'admission.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Check if 'publications' table exists
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='publications'", (err, row) => {
        if (row) {
            console.log("Renaming 'publications' to 'applications'...");
            db.run("ALTER TABLE publications RENAME TO applications", (err) => {
                if (err) {
                    console.error("Rename failed:", err.message);
                } else {
                    console.log("Rename SUCCESS!");
                }
            });
        } else {
            // Check if 'applications' exists
            db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='applications'", (err, row) => {
                if (row) {
                    console.log("'applications' table already exists. No action needed.");
                } else {
                    console.log("Creating 'applications' table...");
                    // Manually create it to be safe
                    db.run(`CREATE TABLE IF NOT EXISTS applications (
                        application_no TEXT PRIMARY KEY,
                        status TEXT CHECK (status IN ('draft', 'submitted', 'verified', 'rejected')) DEFAULT 'draft',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )`);
                }
            });
        }
    });
});
