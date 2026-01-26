const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('backend/admission.sqlite');

db.all("PRAGMA table_info(enquiries)", [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Columns count:", rows.length);
    rows.forEach(row => {
        console.log(`- ${row.name} (${row.type})`);
    });
    db.close();
});
