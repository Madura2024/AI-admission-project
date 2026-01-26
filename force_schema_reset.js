const path = require('path');
const fs = require('fs');
const sqlite3 = require(path.join(__dirname, 'backend/node_modules/sqlite3')).verbose();
const dbPath = path.join(__dirname, 'backend/admission.sqlite');
const schemaPath = path.join(__dirname, 'database/schema_sqlite.sql');

const db = new sqlite3.Database(dbPath);
const schema = fs.readFileSync(schemaPath, 'utf8');

db.serialize(() => {
    console.log("Forcing database schema reset...");

    // Drop tables that were modified
    db.run("DROP TABLE IF EXISTS enquiries");
    db.run("DROP TABLE IF EXISTS personal_details");
    db.run("DROP TABLE IF EXISTS academic_records");

    // Apply full schema
    db.exec(schema, (err) => {
        if (err) {
            console.error("Schema reset failed:", err);
            process.exit(1);
        } else {
            console.log("Database schema reset successfully with new columns!");
        }
    });
});

db.close();
