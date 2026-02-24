const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: String,
    icon: String,
    image: { url: String, publicId: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    type: {
        type: String,
        enum: ['general', 'jobs', 'cars', 'products', 'services', 'real_estate', 'community'],
        default: 'general',
    },
    fields: [{
        name: String,
        label: String,
        type: { type: String, enum: ['text', 'number', 'select', 'boolean', 'date'] },
        options: [String],
        required: Boolean,
    }],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
    color: String,
    metaTitle: String,
    metaDescription: String,
}, { timestamps: true });

CategorySchema.index({ slug: 1 });
CategorySchema.index({ parent: 1 });
CategorySchema.index({ type: 1, isActive: 1 });

CategorySchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    next();
});

module.exports = mongoose.model('Category', CategorySchema);
