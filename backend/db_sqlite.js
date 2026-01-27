const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create DB file in backend folder
const dbPath = path.join(__dirname, 'admission.sqlite');
const db = new sqlite3.Database(dbPath);

console.log(`Connected to SQLite database at ${dbPath}`);

// Helper to convert Postgres query to SQLite
// 1. Replace $1, $2 with ?
// 2. Handle RETURNING (basic support)
function adaptQuery(text, params) {
    let sql = text.replace(/\$\d+/g, '?');

    // Handle PostgreSQL specific functions
    sql = sql.replace(/datetime\('now'\)/gi, "CURRENT_TIMESTAMP");

    // Simple RETURNING handling for INSERT
    if (sql.match(/RETURNING/i)) {
        sql = sql.replace(/RETURNING\s+\w+/i, '');
        return { sql, hasReturning: true };
    }

    return { sql, hasReturning: false };
}

module.exports = {
    query: (text, params = []) => {
        return new Promise((resolve, reject) => {
            const { sql, hasReturning } = adaptQuery(text, params);

            // Log for debugging
            // console.log("SQL:", sql, params);

            if (sql.trim().toUpperCase().startsWith('SELECT')) {
                db.all(sql, params, (err, rows) => {
                    if (err) return reject(err);
                    resolve({ rows, rowCount: rows.length });
                });
            } else {
                db.run(sql, params, function (err) {
                    if (err) return reject(err);

                    // Emulate RETURNING for keys if it was an insert
                    // Specifically for 'enquiries' or 'applications' where we might need the ID or AppNo
                    // BUT: The app mostly uses 'application_no' which is generated in JS and passed in.
                    // So we might not strictly need RETURNING for IDs. 

                    resolve({ rows: [], rowCount: this.changes });
                });
            }
        });
    }
};
