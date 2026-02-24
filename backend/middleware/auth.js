const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - must be logged in
exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Token is invalid.' });
        }
        if (user.isSuspended) {
            return res.status(403).json({ success: false, message: 'Your account has been suspended.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token is not valid.' });
    }
};

// Optional auth - attach user if token present
exports.optionalAuth = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        }
        next();
    } catch {
        next();
    }
};

// Role authorization
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not authorized for this action.`,
            });
        }
        next();
    };
};

// Must be email verified
exports.requireVerified = (req, res, next) => {
    if (!req.user.isEmailVerified) {
        return res.status(403).json({ success: false, message: 'Please verify your email first.' });
    }
    next();
};

// Must be approved by admin
exports.requireApproved = (req, res, next) => {
    if (!req.user.isApproved) {
        return res.status(403).json({ success: false, message: 'Your account is pending admin approval.' });
    }
    next();
};

// City admin can only manage their assigned cities
exports.cityAdminAccess = (req, res, next) => {
    const { user } = req;
    if (user.role === 'super_admin' || user.role === 'admin') return next();
    if (user.role === 'city_admin') {
        const cityId = req.params.cityId || req.body.locationId || req.query.cityId;
        if (cityId && user.assignedCities.some(c => c.toString() === cityId)) {
            return next();
        }
        return res.status(403).json({ success: false, message: 'You do not have access to this city.' });
    }
    return res.status(403).json({ success: false, message: 'Access denied.' });
};
