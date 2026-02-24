const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    promotion: { type: mongoose.Schema.Types.ObjectId, ref: 'PostPromotion' },
    subscriptionPlan: String,

    type: {
        type: String,
        enum: ['promotion', 'subscription', 'featured_banner', 'refund'],
        required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    netAmount: { type: Number, required: true },

    gateway: { type: String, enum: ['razorpay', 'stripe', 'manual'], required: true },
    gatewayOrderId: String,
    gatewayPaymentId: String,
    gatewaySignature: String,
    gatewayResponse: mongoose.Schema.Types.Mixed,

    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
        default: 'pending',
    },
    refundReason: String,
    refundedAt: Date,
    refundedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    description: String,
    invoice: String,
    paidAt: Date,
}, { timestamps: true });

PaymentSchema.index({ user: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ gateway: 1 });
PaymentSchema.index({ paidAt: -1 });

module.exports = mongoose.model('Payment', PaymentSchema);
