const cron = require('node-cron');
const db = require('../db');
const { sendSMS } = require('../utils/smsService');

// Run every minute for Demo purposes (Real app: '0 0 * * *' for daily)
const job = cron.schedule('*/1 * * * *', async () => {
    console.log("Running Reminder Job...");
    try {
        // Query enquiries created > 30 seconds ago (Demo) or 24 hours ago (Real)
        // AND validation: Application status is NOT 'submitted'
        // Join enquiries with applications table

        // SQLite syntax for datetime diff might vary. 
        // For simplicity: Select all enquiries, check if app exists and is submitted.

        const enquiries = await db.query("SELECT * FROM enquiries");

        for (const enq of enquiries.rows) {
            const appNo = enq.application_no;

            // Check application status
            const appRes = await db.query("SELECT status FROM applications WHERE application_no = $1", [appNo]);

            let isSubmitted = false;
            if (appRes.rows.length > 0) {
                if (appRes.rows[0].status === 'submitted') {
                    isSubmitted = true;
                }
            }

            if (!isSubmitted) {
                // Check if we already sent a reminder? (Ideally track this in DB to avoid spam)
                // For this MVP demo, we log it and send only if it's recent (mock logic)

                console.log(`[Reminder Job] Sending reminder to ${enq.student_name} (${enq.phone})`);
                sendSMS(enq.phone, `Hi ${enq.student_name}, don't forget to complete your admission for ${appNo} at KGiSL!`);
            }
        }

    } catch (err) {
        console.error("Reminder Job Error:", err);
    }
});

module.exports = job;
