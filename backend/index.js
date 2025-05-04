import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import multer from "multer";
import path from "path";
import mysql from "mysql";
import bcrypt from 'bcryptjs';

const app = express();
const port = 8800;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "py_project"
});


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Endpoint to upload video
app.post("/upload-video", upload.single("video"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const videoPath = req.file.path;
    res.json({ videoPath });
});


// Endpoint to process video
app.post("/process-video", (req, res) => {
    const { videoPath } = req.body;

    if (!videoPath) {
        return res.status(400).json({ error: "Video path is required" });
    }
    
    const pythonProcess = spawn("python3", ["./python_script.py", videoPath]);
    let pythonOutput = "";

    pythonProcess.stdout.on("data", (data) => {
        pythonOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Python script error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
        try {
            const jsonStart = pythonOutput.indexOf("{");
            const jsonEnd = pythonOutput.lastIndexOf("}") + 1;
            const cleanOutput = pythonOutput.substring(jsonStart, jsonEnd);

            const parsedOutput = JSON.parse(cleanOutput);
            return res.json(parsedOutput);
        } catch (error) {
            console.error("JSON Parsing Error:", error.message);
            return res.status(500).json({ error: "Invalid JSON response from Python" });
        }
    });
});

app.post("/processPrompt", (req, res) => {
    const { title, description, analysisResult } = req.body;

    if (!title || !description || !analysisResult) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    const pythonProcess = spawn("python3", [
        "./python_prompt.py",
        title,
        description,
        JSON.stringify(analysisResult) // Convert object to string
    ]);

    let pythonOutput = "";

    pythonProcess.stdout.on("data", (data) => {
        pythonOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Python script error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
        try {
            const parsedResponse = JSON.parse(pythonOutput);
            return res.json(parsedResponse);
        } catch (error) {
            console.error("JSON Parsing Error:", error.message);
            return res.status(500).json({ error: "Invalid JSON response from Python" });
        }
    });
});


const insertAccount = async (email, password)=>{
    const insertQuery = "INSERT INTO tbl_account (acc_email, acc_password) VALUES (?, ?)";
    const hashPassword = await bcrypt.hash(password, 10);
        
    return new Promise((resolve, reject)=>{
        db.query(insertQuery, [email, hashPassword], (err, result)=>{
            if(err){
                return reject(err)
            }
            resolve(result);
        });
    })
}

app.post("/signup", async (req, res)=>{
    const { email, password } = req.body;
    const checkQuery = "SELECT * FROM tbl_account WHERE acc_email = ?";

    db.query(checkQuery, [email], async (err, result)=>{
        if(err){
            return res.status(500).json({ error: 'Error checking email' });
        }

        if(result.length > 0){
            return res.status(299).json({ error: 'Email already exists' });
        }

        try{
            await insertAccount(email, password);
            return res.status(201).json({ message: 'Account created successfully' });

        } catch (insertErr) {
            console.error('Error inserting account:', insertErr);
            return res.status(500).json({ error: 'Error inserting account' });
        }
    });
    
})

app.post("/login", async (req, res)=>{
    const { email, password } = req.body;
    const checkQuery = "SELECT * FROM tbl_account WHERE acc_email = ?";

    db.query(checkQuery, [email], async (err, result)=>{
        if(err){
            return res.status(500).json({ error: 'Error checking email' });
        }

        if(result.length === 0){
            return res.status(299).json({ error: 'Email does not exist' });
        }

        const user = result[0];

        if(bcrypt.compareSync(password, user.acc_password)){
            return res.json(user)
        }else{
            return res.status(299).json({ error: 'Invalid credentials' });
        }
    });
})

app.get("/user/:acc_id", async (req, res)=>{
    const { acc_id } = req.params;
    const checkQuery = "SELECT * FROM tbl_account WHERE acc_id = ?";

    db.query(checkQuery, [acc_id], (err, result)=>{
        if(err){
            return res.status(500).json({ error: 'Error checking account' });
        }

        if(result.length === 0){
            return res.status(299).json({ error: 'Account does not exist' });
        }

        return res.json(result[0]);
    });
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});