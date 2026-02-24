const Location = require('../models/Location');

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
exports.getLocations = async (req, res, next) => {
    try {
        const locations = await Location.find({ isActive: true }).sort({ state: 1, city: 1 });
        res.json({ success: true, count: locations.length, data: locations });
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured locations
// @route   GET /api/locations/featured
// @access  Public
exports.getFeaturedLocations = async (req, res, next) => {
    try {
        const locations = await Location.find({ isFeatured: true, isActive: true }).sort({ postsCount: -1 });
        res.json({ success: true, count: locations.length, data: locations });
    } catch (error) {
        next(error);
    }
};

// @desc    Create location
// @route   POST /api/locations
// @access  Admin
exports.createLocation = async (req, res, next) => {
    try {
        const location = await Location.create(req.body);
        res.status(201).json({ success: true, data: location });
    } catch (error) {
        next(error);
    }
};

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Admin
exports.updateLocation = async (req, res, next) => {
    try {
        const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }
        res.json({ success: true, data: location });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete location
// @route   DELETE /api/locations/:id
// @access  Super Admin
exports.deleteLocation = async (req, res, next) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }
        await Location.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Location deleted' });
    } catch (error) {
        next(error);
    }
};
