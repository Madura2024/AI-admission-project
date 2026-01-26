const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function initDB() {
    try {
        await client.connect();

        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running Schema...');
        await client.query(schemaSql);
        console.log('Database initialized successfully!');

    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        await client.end();
    }
}

initDB();
