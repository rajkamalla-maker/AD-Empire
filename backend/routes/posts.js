const express = require('express');
const {
    createPost, getPosts, getPost, updatePost, deletePost,
    updatePostStatus, getMyPosts, getFeaturedPosts, getPostsByType,
} = require('../controllers/postController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');
const { uploadImages } = require('../config/cloudinary');
const { auditLog } = require('../middleware/errorHandler');

const router = express.Router();

router.route('/')
    .post(protect, uploadImages.fields([{ name: 'images', maxCount: 10 }, { name: 'video', maxCount: 1 }]), createPost)
    .get(optionalAuth, getPosts);

router.get('/my-posts', protect, getMyPosts);
router.get('/featured', getFeaturedPosts);
router.get('/by-type/:type', getPostsByType);

router.route('/:id')
    .get(optionalAuth, getPost)
    .put(protect, uploadImages.fields([{ name: 'images', maxCount: 10 }, { name: 'video', maxCount: 1 }]), updatePost)
    .delete(protect, deletePost);

router.put('/:id/status', protect, authorize('admin', 'super_admin', 'city_admin'), auditLog('UPDATE_POST_STATUS'), updatePostStatus);

module.exports = router;
