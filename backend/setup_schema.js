const fs = require('fs');
const path = require('path');
const db = require('./db');

const setup = async () => {
    try {
        console.log("Reading schema file...");
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log("Executing schema...");
        await db.query(schemaSql);

        console.log("Schema applied successfully! specific tables like 'enquiries' should now exist.");
        process.exit(0);
    } catch (err) {
        console.error("Schema setup failed:", err);
        process.exit(1);
    }
};

setup();
