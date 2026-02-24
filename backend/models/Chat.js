const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 2000 },
    type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    media: { url: String, publicId: String },
    isRead: { type: Boolean, default: false },
    readAt: Date,
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const ChatSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    messages: [MessageSchema],
    lastMessage: {
        content: String,
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        sentAt: Date,
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: {},
    },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

ChatSchema.index({ participants: 1 });
ChatSchema.index({ post: 1 });
ChatSchema.index({ 'lastMessage.sentAt': -1 });

module.exports = mongoose.model('Chat', ChatSchema);
