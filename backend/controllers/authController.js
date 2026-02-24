const User = require('../models/User');
const crypto = require('crypto');
const { sendVerificationEmail, sendResetPasswordEmail, sendApprovalEmail } = require('../utils/email');
const { createNotification } = require('../utils/notifications');

// Send JWT response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    res.status(statusCode).json({
        success: true,
        token,
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
            city: user.city,
            cityName: user.cityName,
            isEmailVerified: user.isEmailVerified,
            isApproved: user.isApproved,
            subscriptionPlan: user.subscriptionPlan,
        },
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { fullName, email, phone, password, cityId, cityName, state, country } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email or phone already exists.' });
        }

        const user = await User.create({
            fullName, email, phone, password,
            city: cityId, cityName, state, country: country || 'India',
        });

        const verificationToken = user.getEmailVerificationToken();
        await user.save({ validateBeforeSave: false });

        try {
            await sendVerificationEmail(user, verificationToken);
        } catch (emailErr) {
            user.emailVerificationToken = undefined;
            user.emailVerificationExpiry = undefined;
            await user.save({ validateBeforeSave: false });
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please verify your email and wait for admin approval.',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password.' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account is deactivated.' });
        }
        if (user.isSuspended) {
            return res.status(403).json({ success: false, message: `Account suspended: ${user.suspendReason}` });
        }

        // Admins bypass email verification and admin-approval checks
        const isAdminRole = ['admin', 'super_admin', 'city_admin'].includes(user.role);
        if (!isAdminRole) {
            if (!user.isEmailVerified) {
                return res.status(403).json({ success: false, message: 'Please verify your email first.' });
            }
        }

        user.lastLogin = Date.now();
        user.loginCount += 1;
        await user.save({ validateBeforeSave: false });

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification token.' });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpiry = undefined;
        await user.save({ validateBeforeSave: false });

        res.json({ success: true, message: 'Email verified successfully! Awaiting admin approval.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'No user found with that email.' });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });
        await sendResetPasswordEmail(user, resetToken);

        res.json({ success: true, message: 'Password reset email sent.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('city', 'city state country');
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// @desc    Update profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const allowedFields = ['fullName', 'phone', 'bio', 'cityName', 'state', 'socialLinks', 'notificationPreferences'];
        const updates = {};
        allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('+password');
        if (!(await user.matchPassword(req.body.currentPassword))) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
        }
        user.password = req.body.newPassword;
        await user.save();
        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
    res.json({ success: true, message: 'Logged out successfully.' });
};

// @desc    Upload avatar
// @route   POST /api/auth/avatar
// @access  Private
exports.uploadAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image.' });
        }

        const { cloudinary } = require('../config/cloudinary');
        // Delete old avatar
        if (req.user.avatar && req.user.avatar.publicId) {
            await cloudinary.uploader.destroy(req.user.avatar.publicId);
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatar: { url: req.file.path, publicId: req.file.filename } },
            { new: true }
        );

        res.json({ success: true, data: user.avatar });
    } catch (error) {
        next(error);
    }
};
