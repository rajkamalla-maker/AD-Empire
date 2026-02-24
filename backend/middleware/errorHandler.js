const { AdminLog } = require('../models/index');
const logger = require('../utils/logger');

exports.errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    logger.error(err.stack || err.message);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error.message = 'Resource not found.';
        return res.status(404).json({ success: false, message: error.message });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
        return res.status(400).json({ success: false, message: error.message });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ success: false, message: messages.join('. ') });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired.' });
    }

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File size too large.' });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

exports.notFound = (req, res, next) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
};

// Audit log middleware for admin actions
exports.auditLog = (action) => async (req, res, next) => {
    res.on('finish', async () => {
        if (res.statusCode < 400 && req.user) {
            try {
                await AdminLog.create({
                    admin: req.user._id,
                    action,
                    ip: req.ip,
                    userAgent: req.get('User-Agent'),
                    details: { body: req.body, params: req.params, query: req.query },
                });
            } catch (e) {
                logger.error('Audit log error: ' + e.message);
            }
        }
    });
    next();
};
