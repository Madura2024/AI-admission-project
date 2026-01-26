const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'admission.sqlite');
const schemaPath = path.join(__dirname, '../database/schema_sqlite.sql');

const db = new sqlite3.Database(dbPath);

const schema = fs.readFileSync(schemaPath, 'utf8');

db.serialize(() => {
    db.exec(schema, (err) => {
        if (err) {
            console.error("Schema apply failed:", err);
            process.exit(1);
        } else {
            console.log("SQLite Database initialized successfully!");
            console.log("DB File:", dbPath);
        }
    });
});

db.close();
