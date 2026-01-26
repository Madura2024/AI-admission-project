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
    except Exception as e:
        logger.error(f"Internal Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting AI Service on port 5001...")
    app.run(port=5001, debug=True)
