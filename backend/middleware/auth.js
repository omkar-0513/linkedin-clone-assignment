// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. Get token from header
    const authHeader = req.header('Authorization'); // "Bearer <token>"

    // 2. Check if no token
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // 3. Verify token
        // Split "Bearer <token>" and get just the token part
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token format is incorrect' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Add user from payload to the request object
        req.user = decoded.user;
        next(); // Move to the next function (the route)
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};