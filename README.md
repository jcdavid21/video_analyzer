README.txt

---

Project Setup Instructions

This project consists of a Python backend and a React frontend. Follow the steps below to set up and run the application correctly.

---

📦 Dependencies

Make sure you have Python and Node.js installed on your system.

1. Python Backend Dependencies

Install the following Python libraries:

```bash
pip install opencv-python-headless numpy scikit-learn pydub openai-whisper google-generativeai deep-translator deepface
```

These are required for:

- Image and video processing (cv2, numpy)
- Clustering (KMeans)
- Audio handling (pydub)
- Speech-to-text (whisper)
- AI services (google.generativeai)
- Translation (deep-translator)
- Facial analysis (deepface)

2. React Frontend Dependencies

Navigate to the client directory and install frontend dependencies:

cd client
npm install react react-dom react-router-dom react-icons tailwindcss

---

🛠 Project Structure

- client/ – React frontend
- backend/index.js – Entry point for backend server
- python_script.py – Python AI script (edit this file to use your own API key)

---

📌 Setup Notes

1. Database
   - Database name: py_project
   - Table: tbl_account
   - Columns: acc_id, acc_email, acc_password

2. API Key
   - Replace the Api_Key variable in python_script.py with your own Gemini API key.

---

🚀 Running the Project

1. Start the Backend
   - Make sure the backend server is running:
     node backend/index.js

2. Start the Frontend
   - Navigate to the client folder and start the React app:
     cd client
     npm start
