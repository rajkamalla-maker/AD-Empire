const jwt = require('jsonwebtoken');
const User = require('../models/User');

const onlineUsers = new Map(); // userId -> socketId

module.exports = (io) => {
    // Middleware for authentication
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) return next(new Error('Authentication error - No token'));

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('_id fullName role');
            if (!user) return next(new Error('Authentication error - User not found'));

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error - Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.user._id.toString();
        onlineUsers.set(userId, socket.id);

        // Join a personal room for notifications
        socket.join(`user_${userId}`);

        // Broadcast online status
        io.emit('user_status', { userId, status: 'online' });

        socket.on('join_chat', (chatId) => {
            socket.join(`chat_${chatId}`);
        });

        socket.on('leave_chat', (chatId) => {
            socket.leave(`chat_${chatId}`);
        });

        socket.on('typing', ({ chatId, isTyping }) => {
            socket.to(`chat_${chatId}`).emit('user_typing', {
                userId: socket.user._id,
                isTyping
            });
        });

        socket.on('disconnect', async () => {
            onlineUsers.delete(userId);

            // Update last active time in DB (optional/throttle in production)
            await User.findByIdAndUpdate(userId, { lastLogin: new Date() });

            io.emit('user_status', {
                userId,
                status: 'offline',
                lastActive: new Date()
            });
        });
    });
};
