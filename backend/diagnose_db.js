const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'admission.sqlite');
const db = new sqlite3.Database(dbPath);
const logFile = path.join(__dirname, 'db_diagnostic.log');

function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + "\n");
}

fs.writeFileSync(logFile, "=== DB Diagnostic Log ===\n");

db.serialize(() => {
    db.all("PRAGMA table_info(enquiries)", (err, columns) => {
        if (err) {
            log("Error getting table info: " + err.message);
            return;
        }

        const columnNames = columns.map(c => c.name);
        log("Current columns in 'enquiries': " + columnNames.join(", "));

        const required = ['institution', 'course', 'student_name', 'gender', 'dob', 'aadhar_no', 'quota', 'father_name', 'father_occupation', 'mother_name', 'mother_occupation', 'annual_income', 'community', 'address', 'pincode', 'phone_1', 'phone_2', 'phone_3', 'school_name_place', 'school_type', 'board_of_study', 'medium_of_instruction', 'marks_10th_total', 'marks_10th_maths', 'marks_10th_science', 'marks_11th_total', 'marks_11th_phy_eco', 'marks_11th_che_comm', 'marks_11th_maths_accs', 'marks_11th_comp_bio', 'marks_12th_total', 'marks_12th_phy_eco', 'marks_12th_che_comm', 'marks_12th_maths_accs', 'marks_12th_comp_bio', 'group_12th', 'reg_no_12th', 'first_gen_graduate', 'pmss', 'laptop', 'college_bus', 'bus_boarding_point', 'hostel', 'source', 'city', 'state', 'email'];

        required.forEach(col => {
            if (!columnNames.includes(col)) {
                log(`Missing '${col}' column. Adding it...`);
                db.run(`ALTER TABLE enquiries ADD COLUMN ${col} TEXT`, (err) => {
                    if (err) log(`Error adding '${col}': ` + err.message);
                    else log(`'${col}' added successfully.`);
                });
            }
        });
    });
});

setTimeout(() => {
    db.close();
    log("Done checking/updating database.");
}, 3000);
