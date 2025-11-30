const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// --- SMART PATH LOGIC ---
const isPi = os.userInfo().username === 'pi';

// If on Pi, use the NAS folder. If on Laptop, use 'test_storage' folder.
const STORAGE_PATH = isPi
    ? '/home/pi/cloud_storage'
    : path.join(__dirname, '../test_storage');

// Ensure storage directory exists (crucial for laptop dev)
if (!fs.existsSync(STORAGE_PATH)) {
    fs.mkdirSync(STORAGE_PATH, { recursive: true });
    console.log(`Created storage directory at: ${STORAGE_PATH}`);
} else {
    console.log(`Using storage directory: ${STORAGE_PATH}`);
}
// ------------------------

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, STORAGE_PATH),
    filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

// Get Files (Protected)
router.get('/', verifyToken, (req, res) => {
    fs.readdir(STORAGE_PATH, (err, files) => {
        if (err) return res.status(500).json({ error: 'Unable to scan files' });
        res.json(files);
    });
});

// Upload File (Protected)
router.post('/upload', verifyToken, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    res.json({ message: `File ${req.file.originalname} uploaded.` });
});

// Download File (Protected)
router.get('/download/:filename', verifyToken, (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(STORAGE_PATH, filename);

    // Security check: prevent directory traversal (e.g. ../../etc/passwd)
    if (!filePath.startsWith(STORAGE_PATH)) {
        return res.status(403).send("Access denied.");
    }

    res.download(filePath);
});

module.exports = router;