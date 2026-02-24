const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const socketHandler = require('./socket/socketHandler');

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const locationRoutes = require('./routes/locations');
const paymentRoutes = require('./routes/payments');
const promotionRoutes = require('./routes/promotions');
const chatRoutes = require('./routes/chat');
const notificationRoutes = require('./routes/notifications');
const reportRoutes = require('./routes/reports');
const reviewRoutes = require('./routes/reviews');
const savedPostRoutes = require('./routes/savedPosts');
const followRoutes = require('./routes/follows');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const bannerRoutes = require('./routes/banners');
const settingsRoutes = require('./routes/settings');
const searchRoutes = require('./routes/search');
const communityRoutes = require('./routes/community');
const seoRoutes = require('./routes/seo');
const businessRoutes = require('./routes/businessRoutes');

// Connect DB
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

// Socket handler
socketHandler(io);

// Trust proxy
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX || 100,
    message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Attach io to req for use in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/saved', savedPostRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/business', businessRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Marketplace API is running', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = { app, server, io };
