const BusinessListing = require('../models/BusinessListing');
const ErrorResponse = require('../utils/errorResponse');

exports.createBusiness = async (req, res, next) => {
    try {
        req.body.ownerId = req.user.id;
        const newBusiness = await BusinessListing.create(req.body);
        res.status(201).json({ success: true, data: newBusiness });
    } catch (err) {
        next(err);
    }
};

exports.getBusinesses = async (req, res, next) => {
    try {
        // Apply city filter if provided
        const queryStr = { status: 'approved' };
        if (req.query.city) queryStr['locationId.city'] = req.query.city;
        if (req.query.search) {
            queryStr.$text = { $search: req.query.search };
        }

        let query = BusinessListing.find(queryStr)
            .sort({ isFeatured: -1, isVerified: -1, rating: -1, createdAt: -1 });

        const businesses = await query;
        res.status(200).json({ success: true, count: businesses.length, data: businesses });
    } catch (err) {
        next(err);
    }
};

exports.getBusiness = async (req, res, next) => {
    try {
        const business = await BusinessListing.findById(req.params.id);
        if (!business || business.status !== 'approved') {
            // Allow if owner
            if (business && req.user && business.ownerId.toString() === req.user.id) {
                return res.status(200).json({ success: true, data: business });
            }
            return next(new ErrorResponse('Business not found or pending approval', 404));
        }
        res.status(200).json({ success: true, data: business });
    } catch (err) {
        next(err);
    }
};

// Admin routes
exports.getAllAdminBusinesses = async (req, res, next) => {
    try {
        const queryStr = req.user.role === 'city_admin' ? { 'locationId.city': req.user.location } : {};
        const businesses = await BusinessListing.find(queryStr).populate('ownerId', 'fullName email phone');
        res.status(200).json({ success: true, count: businesses.length, data: businesses });
    } catch (err) {
        next(err);
    }
};

exports.updateBusinessStatus = async (req, res, next) => {
    try {
        let business = await BusinessListing.findById(req.params.id);
        if (!business) return next(new ErrorResponse('Business not found', 404));

        business.status = req.body.status || business.status;
        business.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : business.isFeatured;
        business.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : business.isVerified;

        business = await business.save();
        res.status(200).json({ success: true, data: business });
    } catch (err) {
        next(err);
    }
};
