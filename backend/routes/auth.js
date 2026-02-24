const express = require('express');
const {
    register, login, verifyEmail, forgotPassword, resetPassword,
    getMe, updateProfile, changePassword, logout, uploadAvatar,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { uploadAvatar: multerUpload } = require('../config/cloudinary');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.put('/update-profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/logout', logout);
router.post('/avatar', multerUpload.single('avatar'), uploadAvatar);

module.exports = router;
