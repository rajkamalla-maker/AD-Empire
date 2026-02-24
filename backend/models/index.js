const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: String,
    comment: { type: String, maxlength: 1000 },
    isApproved: { type: Boolean, default: true },
    helpful: { type: Number, default: 0 },
}, { timestamps: true });

ReviewSchema.index({ reviewee: 1, isApproved: 1 });
ReviewSchema.index({ post: 1 });

const ReportSchema = new mongoose.Schema({
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: {
        type: String,
        enum: ['spam', 'inappropriate', 'fake', 'scam', 'duplicate', 'other'],
        required: true,
    },
    description: String,
    status: { type: String, enum: ['pending', 'reviewed', 'resolved', 'dismissed'], default: 'pending' },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: Date,
    action: String,
}, { timestamps: true });

ReportSchema.index({ post: 1, status: 1 });
ReportSchema.index({ status: 1 });

const SavedPostSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
}, { timestamps: true });

SavedPostSchema.index({ user: 1, post: 1 }, { unique: true });

const FollowerSchema = new mongoose.Schema({
    follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

FollowerSchema.index({ follower: 1, following: 1 }, { unique: true });

const BannerSchema = new mongoose.Schema({
    title: String,
    image: { url: { type: String, required: true }, publicId: String },
    link: String,
    position: { type: String, enum: ['hero', 'sidebar', 'footer', 'category_top', 'between_posts'], required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    isActive: { type: Boolean, default: true },
    startDate: Date,
    endDate: Date,
    clicks: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    sortOrder: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const AdminLogSchema = new mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    model: String,
    documentId: mongoose.Schema.Types.ObjectId,
    details: mongoose.Schema.Types.Mixed,
    ip: String,
    userAgent: String,
}, { timestamps: true });

AdminLogSchema.index({ admin: 1 });
AdminLogSchema.index({ createdAt: -1 });

const AnalyticsSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    type: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    totalUsers: { type: Number, default: 0 },
    newUsers: { type: Number, default: 0 },
    totalPosts: { type: Number, default: 0 },
    newPosts: { type: Number, default: 0 },
    approvedPosts: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    dailyRevenue: { type: Number, default: 0 },
    activePromotions: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    cityStats: [{ city: String, posts: Number, users: Number, revenue: Number }],
    categoryStats: [{ category: String, posts: Number, views: Number }],
}, { timestamps: true });

AnalyticsSchema.index({ date: -1, type: 1 });

const SettingsSchema = new mongoose.Schema({
    key: { type: String, unique: true, required: true },
    value: mongoose.Schema.Types.Mixed,
    type: { type: String, enum: ['string', 'number', 'boolean', 'object', 'array'], default: 'string' },
    group: String,
    description: String,
    isPublic: { type: Boolean, default: false },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const SubscriptionPlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    type: { type: String, enum: ['free', 'basic', 'premium', 'enterprise'], required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    durationUnit: { type: String, enum: ['days', 'months', 'years'], default: 'days' },
    features: [String],
    maxPosts: { type: Number, default: 5 },
    maxImages: { type: Number, default: 3 },
    canVideoAd: { type: Boolean, default: false },
    canFeature: { type: Boolean, default: false },
    promotionCredits: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isMostPopular: { type: Boolean, default: false },
    color: String,
}, { timestamps: true });

const SocialShareSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    platform: { type: String, enum: ['whatsapp', 'facebook', 'instagram', 'twitter', 'linkedin', 'copy'] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ip: String,
}, { timestamps: true });

module.exports = {
    Review: mongoose.model('Review', ReviewSchema),
    Report: mongoose.model('Report', ReportSchema),
    SavedPost: mongoose.model('SavedPost', SavedPostSchema),
    Follower: mongoose.model('Follower', FollowerSchema),
    Banner: mongoose.model('Banner', BannerSchema),
    AdminLog: mongoose.model('AdminLog', AdminLogSchema),
    Analytics: mongoose.model('Analytics', AnalyticsSchema),
    Settings: mongoose.model('Settings', SettingsSchema),
    SubscriptionPlan: mongoose.model('SubscriptionPlan', SubscriptionPlanSchema),
    SocialShare: mongoose.model('SocialShare', SocialShareSchema),
};
