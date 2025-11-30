const jwt = require('jsonwebtoken');

// We use a simple secret key for now. In production, this should be in a .env file.
const JWT_SECRET = 'my_super_secret_key_123';

const verifyToken = (req, res, next) => {
    // Get token from header (Format: "Bearer <token>")
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = { verifyToken, JWT_SECRET };