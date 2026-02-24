const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
    slug: { type: String, unique: true },
    description: { type: String, required: [true, 'Description is required'], maxlength: 5000 },
    type: {
        type: String,
        enum: ['classified', 'job', 'car', 'product', 'video_ad', 'service'],
        required: true,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Location
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    locationName: String,
    cityName: String,
    state: String,
    country: String,
    address: String,
    coordinates: { lat: Number, lng: Number },

    // Pricing
    price: { type: Number, default: 0 },
    priceNegotiable: { type: Boolean, default: false },
    currency: { type: String, default: 'INR' },
    priceType: { type: String, enum: ['fixed', 'negotiable', 'free', 'contact'], default: 'fixed' },

    // Condition
    condition: { type: String, enum: ['new', 'used', 'refurbished', 'not_applicable'], default: 'not_applicable' },

    // Contact
    contactName: String,
    contactPhone: String,
    contactEmail: String,
    contactWhatsapp: String,
    showPhone: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: false },

    // Media
    images: [{ url: String, publicId: String, isMain: Boolean }],
    video: { url: String, publicId: String, thumbnail: String },

    // Job specific
    jobDetails: {
        company: String,
        jobType: { type: String, enum: ['full_time', 'part_time', 'freelance', 'internship', 'contract'] },
        experience: String,
        salary: { min: Number, max: Number },
        skills: [String],
        qualification: String,
        openings: Number,
        lastDate: Date,
        workMode: { type: String, enum: ['onsite', 'remote', 'hybrid'] },
    },

    // Car specific
    carDetails: {
        brand: String,
        model: String,
        year: Number,
        fuel: { type: String, enum: ['petrol', 'diesel', 'electric', 'hybrid', 'cng'] },
        transmission: { type: String, enum: ['manual', 'automatic'] },
        kmDriven: Number,
        color: String,
        owners: Number,
        insurance: String,
        registration: String,
    },

    // Product specific
    productDetails: {
        brand: String,
        model: String,
        warranty: String,
        returnPolicy: String,
        hsn: String,
    },

    // Custom fields (category specific)
    customFields: mongoose.Schema.Types.Mixed,

    // Status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'expired', 'sold', 'draft'],
        default: 'pending',
    },
    rejectedReason: String,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,

    // Promotion
    isFeatured: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    isSpotlight: { type: Boolean, default: false },
    promotionExpiry: Date,

    // Stats
    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    reportCount: { type: Number, default: 0 },

    // Expiry
    expiryDate: Date,
    isExpired: { type: Boolean, default: false },

    // Tags
    tags: [String],

    // SEO
    metaTitle: String,
    metaDescription: String,
}, { timestamps: true });

// Indexes
PostSchema.index({ slug: 1 });
PostSchema.index({ location: 1, status: 1 });
PostSchema.index({ category: 1, status: 1 });
PostSchema.index({ user: 1 });
PostSchema.index({ type: 1, status: 1 });
PostSchema.index({ isFeatured: 1, isPinned: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ views: -1 });
PostSchema.index({ price: 1 });
PostSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Auto slug
PostSchema.pre('save', function (next) {
    if (!this.slug || this.isModified('title')) {
        const { v4: uuidv4 } = require('uuid');
        this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + uuidv4().slice(0, 8);
    }
    next();
});

// Auto expire check
PostSchema.methods.checkExpiry = function () {
    if (this.expiryDate && new Date() > this.expiryDate) {
        this.isExpired = true;
        this.status = 'expired';
    }
};

module.exports = mongoose.model('Post', PostSchema);
