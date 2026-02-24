const mongoose = require('mongoose');

const PostPromotionSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },

    type: {
        type: String,
        enum: ['homepage_featured', 'pinned', 'category_featured', 'city_spotlight', 'boost'],
        required: true,
    },
    duration: { type: String, enum: ['24hr', '7days', '30days'], required: true },
    price: Number,

    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: false },
    isExpired: { type: Boolean, default: false },

    clicks: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
}, { timestamps: true });

PostPromotionSchema.index({ post: 1 });
PostPromotionSchema.index({ user: 1 });
PostPromotionSchema.index({ isActive: 1, endDate: 1 });
PostPromotionSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('PostPromotion', PostPromotionSchema);
