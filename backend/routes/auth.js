const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { JWT_SECRET } = require('../middleware/auth');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send("Missing fields");

    const hashedPassword = await bcrypt.hash(password, 8);

    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, hashedPassword],
        function (err) {
            if (err) return res.status(400).json({ error: "User already exists" });
            res.status(201).json({ message: "User created" });
        }
    );
});

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err || !user) return res.status(404).json({ error: "User not found" });

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ error: "Invalid password" });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: 86400 }); // 24 hours
        res.status(200).json({ auth: true, token: token });
    });
});

module.exports = router;