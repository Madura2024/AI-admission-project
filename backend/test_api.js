const axios = require('axios');

async function testApi() {
    console.log("Testing POST /api/enquiry...");
    try {
        const res = await axios.post('http://localhost:5000/api/enquiry', {
            student_name: "Test Student",
            email: "test@example.com",
            phone: "9876543210",
            qualification: "12th",
            marks: 85,
            interested_stream: "Engineering"
        });
        console.log("SUCCESS:", res.data);
    } catch (err) {
        console.error("FAILED:");
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", err.response.data);
        } else {
            console.error("Error:", err.message);
        }
    }
}

testApi();
