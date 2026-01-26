const path = require('path');
const sqlite3 = require(path.join(__dirname, 'backend/node_modules/sqlite3')).verbose();
const db = new sqlite3.Database('backend/admission.sqlite');

db.all("PRAGMA table_info(enquiries)", [], (err, rows) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("Enquiries Table Info:");
    console.log("Columns count:", rows.length);
    rows.forEach(row => {
        console.log(`- ${row.name} (${row.type})`);
    });
    db.close();
});
