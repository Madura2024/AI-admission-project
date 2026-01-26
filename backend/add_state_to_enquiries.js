const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'admission.sqlite');
const db = new sqlite3.Database(dbPath);

console.log(`Updating database at ${dbPath}`);

db.serialize(() => {
    db.run("ALTER TABLE enquiries ADD COLUMN state TEXT", (err) => {
        if (err) {
            if (err.message.includes("duplicate column name")) {
                console.log("Column 'state' already exists.");
            } else {
                console.error("Error adding column:", err.message);
            }
        } else {
            console.log("Column 'state' added successfully to 'enquiries' table.");
        }
        db.close();
    });
});
