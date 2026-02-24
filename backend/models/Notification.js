const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
        type: String,
        enum: [
            'post_approved', 'post_rejected', 'post_expired',
            'promotion_activated', 'promotion_expired',
            'new_message', 'new_review', 'new_follower',
            'post_saved', 'post_reported', 'payment_success',
            'payment_failed', 'account_approved', 'account_suspended',
            'system', 'admin_message',
        ],
        required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: mongoose.Schema.Types.Mixed,
    link: String,
    isRead: { type: Boolean, default: false },
    readAt: Date,
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

NotificationSchema.index({ recipient: 1, isRead: 1 });
NotificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
