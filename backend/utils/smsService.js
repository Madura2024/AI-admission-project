const sendSMS = (to, message) => {
    // In a real app, you would use Twilio or another SMS gateway here.
    // const client = require('twilio')(accountSid, authToken);
    // client.messages.create({ ... });

    // For Development/Demo, we simulate by logging to console:
    console.log("========================================");
    console.log("          SENDING SMS                   ");
    console.log("========================================");
    console.log(`TO:      ${to}`);
    console.log(`MESSAGE: ${message}`);
    console.log("========================================");
};

module.exports = { sendSMS };
