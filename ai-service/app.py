from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "running", "service": "AI Recommendation Service"})

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
        logger.info(f"Received Recommendation Request: {data}")

        if not data:
            return jsonify({"error": "No data provided"}), 400

        marks = int(data.get('marks', 0))
        qualification = data.get('qualification', '')
        stream = data.get('stream', '') # Optional
        
        # Logic:
        # If marks > 80 -> Engineering
        # If marks > 60 -> Science
        # Else -> Arts
        
        if marks > 80:
            recommended_stream = 'Engineering'
            reason = "High academic performance suitable for Engineering."
        elif marks > 60:
            recommended_stream = 'Science'
            reason = "Good academic standing suitable for Science streams."
        else:
            recommended_stream = 'Arts'
            reason = "Scores align with Arts and Humanities programs."

        logger.info(f"Recommendation: {recommended_stream}")

        return jsonify({
            "recommended_course": recommended_stream,
            "message": reason
        })

    except ValueError:
        logger.error("Invalid marks format")
        return jsonify({"error": "Invalid marks format"}), 400
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message', '').lower()
        
        # Simple rule-based chatbot for admission queries
        if 'cutoff' in message or 'calculate' in message:
            response = "The cutoff is calculated as: Maths + (Physics/2) + (Chemistry/2). It is out of 200."
        elif 'documents' in message or 'certificate' in message:
            response = "You will need: 10th & 12th Marksheets, Aadhaar Card, Community Certificate, and Transfer Certificate."
        elif 'fees' in message:
            response = "Fees vary by course. You can check the 'Courses' section for detailed fee structures."
        elif 'deadline' in message or 'last date' in message:
            response = "The last date for registration depends on the government counseling schedule. We recommend applying early."
        elif 'hi' in message or 'hello' in message:
            response = "Hello! I am your Admission Assistant. How can I help you with the form today?"
        else:
            response = "I'm here to help with your admission! You can ask about cutoff calculation, required documents, or courses."

        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting AI Service on port 5001...")
    app.run(port=5001, debug=True)
