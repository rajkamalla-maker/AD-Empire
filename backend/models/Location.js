const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    country: { type: String, required: true, default: 'India' },
    state: { type: String, required: true },
    city: { type: String, required: true },
    slug: { type: String, unique: true },
    pincode: [String],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    population: Number,
    timezone: { type: String, default: 'Asia/Kolkata' },
    coordinates: {
        lat: Number,
        lng: Number,
    },
    postsCount: { type: Number, default: 0 },
    usersCount: { type: Number, default: 0 },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: { url: String, publicId: String },
    description: String,
    metaTitle: String,
    metaDescription: String,
}, { timestamps: true });

LocationSchema.index({ country: 1, state: 1, city: 1 });
LocationSchema.index({ slug: 1 });
LocationSchema.index({ isActive: 1 });

LocationSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = `${this.city}-${this.state}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    next();
});

module.exports = mongoose.model('Location', LocationSchema);
