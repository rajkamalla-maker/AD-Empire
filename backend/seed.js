/**
 * Seed Script — Creates Super Admin + sample data
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Location = require('./models/Location');
const { Settings, SubscriptionPlan } = require('./models/index');

const ADMIN_EMAIL = 'admin@marketplace.com';
const ADMIN_PASSWORD = 'Admin@123456';

const CATEGORIES = [
    { name: 'Cars & Bikes', icon: '🚗', type: 'cars', color: '#3B82F6' },
    { name: 'Mobiles & Tablets', icon: '📱', type: 'products', color: '#10B981' },
    { name: 'Real Estate', icon: '🏠', type: 'general', color: '#F97316' },
    { name: 'Jobs', icon: '💼', type: 'jobs', color: '#8B5CF6' },
    { name: 'Electronics', icon: '💻', type: 'products', color: '#06B6D4' },
    { name: 'Furniture', icon: '🛋️', type: 'products', color: '#EAB308' },
    { name: 'Fashion & Clothing', icon: '👗', type: 'products', color: '#EC4899' },
    { name: 'Pets & Animals', icon: '🐶', type: 'general', color: '#F59E0B' },
    { name: 'Services', icon: '🔧', type: 'services', color: '#14B8A6' },
    { name: 'Education', icon: '📚', type: 'general', color: '#6366F1' },
    { name: 'Sports & Hobbies', icon: '⚽', type: 'general', color: '#84CC16' },
    { name: 'Community', icon: '🤝', type: 'community', color: '#0F5E9C' },
];

const LOCATIONS = [
    { country: 'India', state: 'Maharashtra', city: 'Mumbai', isFeatured: true },
    { country: 'India', state: 'Delhi', city: 'Delhi', isFeatured: true },
    { country: 'India', state: 'Karnataka', city: 'Bengaluru', isFeatured: true },
    { country: 'India', state: 'Telangana', city: 'Hyderabad', isFeatured: true },
    { country: 'India', state: 'Tamil Nadu', city: 'Chennai', isFeatured: true },
    { country: 'India', state: 'Maharashtra', city: 'Pune', isFeatured: true },
    { country: 'India', state: 'West Bengal', city: 'Kolkata', isFeatured: true },
    { country: 'India', state: 'Gujarat', city: 'Ahmedabad', isFeatured: false },
    { country: 'India', state: 'Rajasthan', city: 'Jaipur', isFeatured: false },
    { country: 'India', state: 'Uttar Pradesh', city: 'Lucknow', isFeatured: false },
    { country: 'India', state: 'Madhya Pradesh', city: 'Bhopal', isFeatured: false },
    { country: 'India', state: 'Kerala', city: 'Kochi', isFeatured: false },
    { country: 'India', state: 'Andhra Pradesh', city: 'Visakhapatnam', isFeatured: false },
    { country: 'India', state: 'Punjab', city: 'Chandigarh', isFeatured: false },
    { country: 'India', state: 'Tamil Nadu', city: 'Coimbatore', isFeatured: false },
];

const SETTINGS = [
    { key: 'site_name', value: 'Marketplace', type: 'string', group: 'general', isPublic: true },
    { key: 'site_tagline', value: 'Buy & Sell Anything Near You', type: 'string', group: 'general', isPublic: true },
    { key: 'contact_email', value: 'support@marketplace.com', type: 'string', group: 'general', isPublic: true },
    { key: 'promotion_homepage_24hr', value: 299, type: 'number', group: 'pricing' },
    { key: 'promotion_homepage_7days', value: 799, type: 'number', group: 'pricing' },
    { key: 'promotion_homepage_30days', value: 1999, type: 'number', group: 'pricing' },
    { key: 'promotion_pinned_24hr', value: 199, type: 'number', group: 'pricing' },
    { key: 'promotion_pinned_7days', value: 499, type: 'number', group: 'pricing' },
    { key: 'promotion_city_spotlight_30days', value: 999, type: 'number', group: 'pricing' },
    { key: 'max_images_per_post', value: 10, type: 'number', group: 'limits' },
    { key: 'free_ads_per_user', value: 5, type: 'number', group: 'limits' },
    { key: 'ad_expiry_days', value: 60, type: 'number', group: 'limits' },
    { key: 'require_admin_approval', value: true, type: 'boolean', group: 'moderation' },
    { key: 'require_email_verification', value: true, type: 'boolean', group: 'moderation' },
];

const PLANS = [
    { name: 'Free', type: 'free', price: 0, duration: 30, durationUnit: 'days', maxPosts: 5, maxImages: 3, features: ['Post 5 free ads/month', '3 images per ad', 'Basic listing'], isActive: true },
    { name: 'Basic', type: 'basic', price: 299, duration: 30, durationUnit: 'days', maxPosts: 20, maxImages: 6, features: ['20 ads/month', '6 images per ad', 'Priority listing', 'Phone visible'], isActive: true },
    { name: 'Premium', type: 'premium', price: 999, duration: 30, durationUnit: 'days', maxPosts: 100, maxImages: 10, canVideoAd: true, canFeature: true, promotionCredits: 2, features: ['Unlimited ads', '10 images + video', 'Featured badge', '2 free promotions/month', 'Verified seller badge'], isActive: true, isMostPopular: true },
    { name: 'Enterprise', type: 'enterprise', price: 2999, duration: 30, durationUnit: 'days', maxPosts: 1000, maxImages: 20, canVideoAd: true, canFeature: true, promotionCredits: 10, features: ['Unlimited everything', 'Dedicated support', 'Custom branding', '10 free promotions/month', 'Analytics dashboard'], isActive: true },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // ── Super Admin ──────────────────────────────────────────────────
        const existing = await User.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            console.log('ℹ️  Super Admin already exists. Skipping user creation.');
        } else {
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

            await User.create({
                fullName: 'Super Admin',
                email: ADMIN_EMAIL,
                phone: '9000000000',
                password: hashedPassword,
                role: 'super_admin',
                isEmailVerified: true,
                isApproved: true,
                isActive: true,
                cityName: 'Mumbai',
                state: 'Maharashtra',
                country: 'India',
            });
            console.log('✅ Super Admin created');
        }

        // ── Categories ───────────────────────────────────────────────────
        const catCount = await Category.countDocuments();
        if (catCount === 0) {
            for (let i = 0; i < CATEGORIES.length; i++) {
                const cat = CATEGORIES[i];
                await Category.create({
                    name: cat.name,
                    icon: cat.icon,
                    type: cat.type,
                    color: cat.color,
                    sortOrder: i,
                    isActive: true,
                    isFeatured: i < 6,
                });
            }
            console.log(`✅ ${CATEGORIES.length} categories seeded`);
        } else {
            console.log('ℹ️  Categories already exist. Skipping.');
        }

        // ── Locations ────────────────────────────────────────────────────
        const locCount = await Location.countDocuments();
        if (locCount === 0) {
            for (const loc of LOCATIONS) {
                await Location.create(loc);
            }
            console.log(`✅ ${LOCATIONS.length} locations seeded`);
        } else {
            console.log('ℹ️  Locations already exist. Skipping.');
        }

        // ── Settings ─────────────────────────────────────────────────────
        const setCount = await Settings.countDocuments();
        if (setCount === 0) {
            for (const s of SETTINGS) {
                await Settings.create(s);
            }
            console.log(`✅ ${SETTINGS.length} settings seeded`);
        } else {
            console.log('ℹ️  Settings already exist. Skipping.');
        }

        // ── Subscription Plans ───────────────────────────────────────────
        const planCount = await SubscriptionPlan.countDocuments();
        if (planCount === 0) {
            for (const plan of PLANS) {
                await SubscriptionPlan.create(plan);
            }
            console.log(`✅ ${PLANS.length} subscription plans seeded`);
        } else {
            console.log('ℹ️  Subscription plans already exist. Skipping.');
        }

        console.log('\n══════════════════════════════════════════════');
        console.log('  🚀 Seeding complete!');
        console.log('══════════════════════════════════════════════');
        console.log('  Admin Login Credentials:');
        console.log(`  📧 Email   : ${ADMIN_EMAIL}`);
        console.log(`  🔑 Password: ${ADMIN_PASSWORD}`);
        console.log('  🌐 Admin URL: http://localhost:5173/admin');
        console.log('══════════════════════════════════════════════\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
};

seed();
