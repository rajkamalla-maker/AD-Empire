const express = require('express');
const {
    getLocations, getFeaturedLocations,
    createLocation, updateLocation, deleteLocation
} = require('../controllers/locationController');
const { protect, authorize } = require('../middleware/auth');
const { auditLog } = require('../middleware/errorHandler');

const router = express.Router();

router.route('/')
    .get(getLocations)
    .post(protect, authorize('super_admin'), auditLog('CREATE_LOCATION'), createLocation);

router.get('/featured', getFeaturedLocations);

router.route('/:id')
    .put(protect, authorize('super_admin'), auditLog('UPDATE_LOCATION'), updateLocation)
    .delete(protect, authorize('super_admin'), auditLog('DELETE_LOCATION'), deleteLocation);

module.exports = router;
