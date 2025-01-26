const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../config');

const authenticate = async (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new Error('Token is missing');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.user = decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

module.exports = authenticate;