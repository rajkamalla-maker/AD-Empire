const express = require('express');
const {
    getCategories, getCategory,
    createCategory, updateCategory, deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');
const { uploadAvatar } = require('../config/cloudinary'); // Reusing image storage
const { auditLog } = require('../middleware/errorHandler');

const router = express.Router();

router.route('/')
    .get(getCategories)
    .post(protect, authorize('super_admin'), uploadAvatar.single('image'), auditLog('CREATE_CATEGORY'), createCategory);

router.route('/:id')
    .get(getCategory)
    .put(protect, authorize('super_admin'), uploadAvatar.single('image'), auditLog('UPDATE_CATEGORY'), updateCategory)
    .delete(protect, authorize('super_admin'), auditLog('DELETE_CATEGORY'), deleteCategory);

module.exports = router;
