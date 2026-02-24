const Post = require('../models/Post');
const User = require('../models/User');
const Location = require('../models/Location');
const { cloudinary } = require('../config/cloudinary');
const { createNotification } = require('../utils/notifications');
const { sendPostApprovalEmail } = require('../utils/email');
const { paginate } = require('../utils/paginate');

// @desc    Create post
// @route   POST /api/posts
// @access  Private (verified + approved)
exports.createPost = async (req, res, next) => {
    try {
        const postData = { ...req.body, user: req.user._id };

        // Handle uploaded images
        if (req.files && req.files.images) {
            postData.images = req.files.images.map((f, i) => ({
                url: f.path,
                publicId: f.filename,
                isMain: i === 0,
            }));
        }
        if (req.files && req.files.video && req.files.video[0]) {
            postData.video = { url: req.files.video[0].path, publicId: req.files.video[0].filename };
        }

        // Get location info
        const location = await Location.findById(postData.location);
        if (location) {
            postData.locationName = location.city;
            postData.cityName = location.city;
            postData.state = location.state;
            postData.country = location.country;
            await Location.findByIdAndUpdate(location._id, { $inc: { postsCount: 1 } });
        }

        const post = await Post.create(postData);

        // Update user post count
        await User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: 1 } });

        res.status(201).json({ success: true, data: post, message: 'Post submitted for admin approval.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get posts with filters
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
    try {
        const { type, category, location, city, state, status = 'approved', featured, pinned, page, limit, sort, minPrice, maxPrice, condition } = req.query;
        const filter = { status };

        if (type) filter.type = type;
        if (category) filter.category = category;
        if (location) filter.location = location;
        if (city) filter.cityName = new RegExp(city, 'i');
        if (state) filter.state = new RegExp(state, 'i');
        if (featured === 'true') filter.isFeatured = true;
        if (pinned === 'true') filter.isPinned = true;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (condition) filter.condition = condition;

        const sortMap = {
            latest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            price_low: { price: 1 },
            price_high: { price: -1 },
            most_viewed: { views: -1 },
            featured: { isFeatured: -1, isPinned: -1, createdAt: -1 },
        };

        const result = await paginate(Post, filter, {
            page,
            limit: limit || 20,
            sort: sortMap[sort] || { isFeatured: -1, isPinned: -1, createdAt: -1 },
            populate: [
                { path: 'category', select: 'name slug icon' },
                { path: 'user', select: 'fullName avatar rating reviewsCount' },
                { path: 'location', select: 'city state country' },
            ],
        });

        res.json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res, next) => {
    try {
        const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
            ? { _id: req.params.id }
            : { slug: req.params.id };

        const post = await Post.findOne(query)
            .populate('category', 'name slug icon')
            .populate('user', 'fullName avatar rating reviewsCount phone email socialLinks city cityName')
            .populate('location', 'city state country');

        if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

        // Increment views
        await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
        await User.findByIdAndUpdate(post.user._id, { $inc: { totalViews: 1 } });

        res.json({ success: true, data: post });
    } catch (error) {
        next(error);
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res, next) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

        const isOwner = post.user.toString() === req.user._id.toString();
        const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        // Reset to pending if user edits
        if (isOwner && !isAdmin) req.body.status = 'pending';

        post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json({ success: true, data: post });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

        const isOwner = post.user.toString() === req.user._id.toString();
        const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        // Delete media from cloudinary
        for (const img of post.images || []) {
            if (img.publicId) await cloudinary.uploader.destroy(img.publicId).catch(() => { });
        }
        if (post.video && post.video.publicId) {
            await cloudinary.uploader.destroy(post.video.publicId, { resource_type: 'video' }).catch(() => { });
        }

        await Post.findByIdAndDelete(req.params.id);
        await User.findByIdAndUpdate(post.user, { $inc: { postsCount: -1 } });
        await Location.findByIdAndUpdate(post.location, { $inc: { postsCount: -1 } });

        res.json({ success: true, message: 'Post deleted.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve/Reject post (admin)
// @route   PUT /api/posts/:id/status
// @access  Admin
exports.updatePostStatus = async (req, res, next) => {
    try {
        const { status, rejectedReason } = req.body;
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { status, rejectedReason, approvedBy: req.user._id, approvedAt: status === 'approved' ? new Date() : undefined },
            { new: true }
        ).populate('user', 'fullName email');

        if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

        const notifType = status === 'approved' ? 'post_approved' : 'post_rejected';
        await createNotification({
            recipientId: post.user._id,
            senderId: req.user._id,
            type: notifType,
            title: status === 'approved' ? 'Your ad is live!' : 'Your ad was rejected',
            message: status === 'approved'
                ? `Your ad "${post.title}" has been approved.`
                : `Your ad "${post.title}" was rejected. Reason: ${rejectedReason || 'Not specified'}`,
            link: `/post/${post.slug}`,
            io: req.io,
        });

        if (status === 'approved') {
            await sendPostApprovalEmail(post.user, post).catch(() => { });
        }

        res.json({ success: true, data: post });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my posts
// @route   GET /api/posts/my-posts
// @access  Private
exports.getMyPosts = async (req, res, next) => {
    try {
        const { status, page, limit } = req.query;
        const filter = { user: req.user._id };
        if (status) filter.status = status;

        const result = await paginate(Post, filter, {
            page, limit,
            populate: [{ path: 'category', select: 'name slug icon' }],
        });

        res.json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured/homepage posts
// @route   GET /api/posts/featured
// @access  Public
exports.getFeaturedPosts = async (req, res, next) => {
    try {
        const { cityId, limit = 8 } = req.query;
        const filter = { status: 'approved', isFeatured: true };
        if (cityId) filter.location = cityId;

        const posts = await Post.find(filter)
            .sort({ promotionExpiry: -1, createdAt: -1 })
            .limit(parseInt(limit))
            .populate('category', 'name icon')
            .populate('user', 'fullName avatar rating')
            .populate('location', 'city state');

        res.json({ success: true, data: posts });
    } catch (error) {
        next(error);
    }
};

// @desc    Get posts by type for homepage sections
// @route   GET /api/posts/by-type/:type
// @access  Public
exports.getPostsByType = async (req, res, next) => {
    try {
        const { cityId, limit = 8 } = req.query;
        const filter = { status: 'approved', type: req.params.type };
        if (cityId) filter.location = cityId;

        const posts = await Post.find(filter)
            .sort({ isFeatured: -1, isPinned: -1, createdAt: -1 })
            .limit(parseInt(limit))
            .populate('category', 'name icon')
            .populate('user', 'fullName avatar rating')
            .populate('location', 'city');

        res.json({ success: true, data: posts });
    } catch (error) {
        next(error);
    }
};
