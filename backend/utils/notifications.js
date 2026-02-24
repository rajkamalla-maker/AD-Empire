const Notification = require('../models/Notification');

/**
 * Create and emit a real-time notification
 */
const createNotification = async ({ recipientId, senderId, type, title, message, data, link, io }) => {
    try {
        const notification = await Notification.create({
            recipient: recipientId,
            sender: senderId,
            type,
            title,
            message,
            data,
            link,
        });

        // Emit via Socket.io if available
        if (io) {
            io.to(`user_${recipientId}`).emit('notification', {
                ...notification.toObject(),
                sender: senderId,
            });
        }

        return notification;
    } catch (error) {
        console.error('Notification error:', error);
    }
};

module.exports = { createNotification };
