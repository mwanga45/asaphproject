require("dotenv").config();
const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Access Denied. No token provided" });
    }

    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: "Access Denied. Invalid token format" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ message: "Invalid token" });
    }
};

const isAuthenticated = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        next();
    });
};


const isAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access Denied. Admin privileges required" });
        }
        next();
    });
};
const isUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user || req.user.role !== 'user') {
            return res.status(403).json({ message: "Access Denied. User privileges required" });
        }
        next();
    });
};
module.exports = {
    verifyToken,
    isAuthenticated,
    isAdmin,
    isUser
};