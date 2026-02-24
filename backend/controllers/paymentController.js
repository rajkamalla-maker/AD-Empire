const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const PostPromotion = require('../models/PostPromotion');
const User = require('../models/User');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { amount, type, postId, promotionType, duration } = req.body;

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Create pending payment record
        const payment = await Payment.create({
            user: req.user._id,
            post: postId,
            type,
            amount,
            netAmount: amount,
            gateway: 'razorpay',
            gatewayOrderId: order.id,
            status: 'pending',
            description: `Payment for ${type} - ${promotionType || ''}`,
        });

        res.json({ success: true, order, paymentId: payment._id });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_id, postId, promotionType, duration } = req.body;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            await Payment.findByIdAndUpdate(payment_id, { status: 'failed', gatewayResponse: req.body });
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }

        // Payment is successful
        const payment = await Payment.findByIdAndUpdate(payment_id, {
            status: 'completed',
            gatewayPaymentId: razorpay_payment_id,
            gatewaySignature: razorpay_signature,
            gatewayResponse: req.body,
            paidAt: Date.now(),
        }, { new: true });

        // Handle what they paid for
        if (payment.type === 'promotion') {
            const promotion = await PostPromotion.create({
                post: postId,
                user: req.user._id,
                payment: payment._id,
                type: promotionType,
                duration: duration,
                price: payment.amount,
                startDate: Date.now(),
                endDate: new Date(Date.now() + getDurationMs(duration)),
                isActive: true,
            });

            // Update post based on promotion
            const Post = require('../models/Post');
            const updateData = { promotionExpiry: promotion.endDate };
            if (promotionType === 'homepage_featured') updateData.isFeatured = true;
            if (promotionType === 'pinned') updateData.isPinned = true;
            if (promotionType === 'city_spotlight') updateData.isSpotlight = true;

            await Post.findByIdAndUpdate(postId, updateData);

            payment.promotion = promotion._id;
            await payment.save();
        }

        res.json({ success: true, message: 'Payment verified and processed successfully', payment });
    } catch (error) {
        next(error);
    }
};

const getDurationMs = (duration) => {
    if (duration === '24hr') return 24 * 60 * 60 * 1000;
    if (duration === '7days') return 7 * 24 * 60 * 60 * 1000;
    if (duration === '30days') return 30 * 24 * 60 * 60 * 1000;
    return 24 * 60 * 60 * 1000; // Default 1 day
};
