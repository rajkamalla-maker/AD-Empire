const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter valid email'],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[0-9]{10,15}$/, 'Please enter valid phone number'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'premium', 'city_admin', 'admin', 'super_admin'],
        default: 'user',
    },
    avatar: {
        url: { type: String, default: '' },
        publicId: { type: String, default: '' },
    },
    bio: { type: String, maxlength: 500 },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
    },
    cityName: String,
    state: String,
    country: { type: String, default: 'India' },
    assignedCities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
    socialLinks: {
        website: String,
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String,
        whatsapp: String,
        youtube: String,
    },
    isEmailVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isSuspended: { type: Boolean, default: false },
    suspendReason: String,
    emailVerificationToken: String,
    emailVerificationExpiry: Date,
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    subscriptionPlan: {
        type: String,
        enum: ['free', 'basic', 'premium', 'enterprise'],
        default: 'free',
    },
    subscriptionExpiry: Date,
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    referralCount: { type: Number, default: 0 },
    notificationPreferences: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true },
        postApproval: { type: Boolean, default: true },
        promotionExpiry: { type: Boolean, default: true },
        messages: { type: Boolean, default: true },
    },
}, { timestamps: true });

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ city: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isApproved: 1, isActive: 1 });

// Encrypt password
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Generate username from name
UserSchema.pre('save', function (next) {
    if (!this.username && this.fullName) {
        this.username = this.fullName.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now().toString().slice(-4);
    }
    next();
});

// Generate referral code
UserSchema.pre('save', function (next) {
    if (!this.referralCode) {
        this.referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    }
    next();
});

// Match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

// Generate email verification token
UserSchema.methods.getEmailVerificationToken = function () {
    const token = crypto.randomBytes(32).toString('hex');
    this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
    this.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000;
    return token;
};

// Generate password reset token
UserSchema.methods.getResetPasswordToken = function () {
    const token = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    this.resetPasswordExpiry = Date.now() + 30 * 60 * 1000;
    return token;
};

module.exports = mongoose.model('User', UserSchema);
