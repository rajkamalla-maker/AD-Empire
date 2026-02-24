const mongoose = require('mongoose');

const businessListingSchema = new mongoose.Schema({
    businessName: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: String, required: true, default: 'Services' }, // Generally under Services
    businessCategory: { type: String, required: true }, // e.g., Plumber, Salon
    description: { type: String, required: true },
    establishedYear: { type: Number },
    contactDetails: {
        phone: { type: String, required: true },
        whatsapp: { type: String },
        email: { type: String },
        website: { type: String }
    },
    locationId: {
        country: { type: String, default: 'India' },
        state: { type: String },
        city: { type: String, required: true },
        address: { type: String, required: true },
        pincode: { type: String },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        }
    },
    servicesOffered: [{ type: String }],
    workingHours: { type: String }, // e.g., "9 AM - 6 PM"
    priceRange: { type: String }, // optional
    gstNumber: { type: String }, // optional
    socialLinks: {
        facebook: { type: String },
        instagram: { type: String },
        linkedin: { type: String }
    },
    media: {
        logo: { type: String },
        coverImage: { type: String },
        gallery: [{ type: String }],
        video: { type: String }
    },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending' },
    isFeatured: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    premiumExpiryDate: { type: Date }
}, { timestamps: true });

businessListingSchema.index({ 'locationId.city': 1 });
businessListingSchema.index({ businessCategory: 1 });
businessListingSchema.index({ isFeatured: -1, rating: -1 });
businessListingSchema.index({ businessName: 'text', servicesOffered: 'text' });

const BusinessListing = mongoose.model('BusinessListing', businessListingSchema);

module.exports = BusinessListing;
