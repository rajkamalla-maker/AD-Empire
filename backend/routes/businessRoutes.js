const express = require('express');
const { createBusiness, getBusinesses, getBusiness, getAllAdminBusinesses, updateBusinessStatus } = require('../controllers/businessController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getBusinesses)
    .post(protect, createBusiness);

router.route('/:id')
    .get(getBusiness);

// Admin Routes
router.route('/admin/all')
    .get(protect, authorize('admin', 'super_admin', 'city_admin'), getAllAdminBusinesses);

router.route('/admin/:id')
    .put(protect, authorize('admin', 'super_admin', 'city_admin'), updateBusinessStatus);

module.exports = router;
