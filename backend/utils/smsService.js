const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const sendSMS = async (to, message) => {
    // 1. Log to console for development visibility
    console.log("========================================");
    console.log("          INITIATING SMS                ");
    console.log("========================================");
    console.log(`TO:      ${to}`);
    console.log(`MESSAGE: ${message}`);

    // 2. Attempt to send via Twilio if credentials exist
    if (accountSid && authToken && twilioNumber && accountSid !== 'your_account_sid_here') {
        try {
            const client = twilio(accountSid, authToken);
            const response = await client.messages.create({
                body: message,
                from: twilioNumber,
                to: to.startsWith('+') ? to : `+91${to}` // Defaulting to +91 for India if no prefix
            });
            console.log(`STATUS: Sent Successfully (SID: ${response.sid})`);
        } catch (error) {
            console.error(`STATUS: Twilio Error - ${error.message}`);
        }
    } else {
        console.log("STATUS: Simulation Mode (No valid Twilio credentials provided)");
    }
    console.log("========================================");
};

module.exports = { sendSMS };
