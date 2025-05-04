import os
import json
import logging
import sys
import google.generativeai as genai

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Suppress unnecessary logs
os.environ["GLOG_minloglevel"] = "2"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["GRPC_VERBOSITY"] = "NONE"

# Set your Gemini API key
genai.configure(api_key="AIzaSyDliYbJHopLp2GPRA8NS5eVwMRQGVu6SJY")

def generate_response(title, description, analysis_result):
    model = genai.GenerativeModel("gemini-2.0-flash")

    # Ensure analysis_result is formatted properly in the prompt
    analysis_result_str = json.dumps(analysis_result, indent=2)

    prompt = (
        f"Generate a response based on analysis result: {analysis_result_str}\n"
        f"Title: {title}\n"
        f"Description: {description}\n"
        f"Analysis Result (JSON): {analysis_result_str}\n"
        f"The response should be in html format.\n"
        f"Return the response strictly in JSON format with the following structure:\n"
        "{\n"
        "  \"response\": \"The generated response\"\n"
        "}\n"
    )

    try:
        response = model.generate_content(prompt)
        json_text = response.text.strip().replace("```json", "").replace("```", "").strip()
        json_response = json.loads(json_text)
        logging.info("Response generated successfully")
        return json_response
    except json.JSONDecodeError:
        logging.error(f"Failed to parse JSON response. Raw response: {response.text}")
        return {"error": "Failed to parse Gemini response", "raw": response.text}
    except Exception as e:
        logging.error(f"Error generating response: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(json.dumps({"error": "Expected 3 arguments: title, description, analysisResult"}))
        sys.exit(1)

    title = sys.argv[1]
    description = sys.argv[2]

    # Parse analysisResult as JSON
    try:
        analysis_result = json.loads(sys.argv[3])
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON format for analysisResult"}))
        sys.exit(1)

    result = generate_response(title, description, analysis_result)

    try:
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
